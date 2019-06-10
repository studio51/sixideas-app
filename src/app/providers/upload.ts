import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

import { Storage } from '@ionic/storage';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer/ngx';

import { Image } from '../interfaces/image';

export interface UploadResponse {
  status: string,
  image: Image
}

@Injectable({
  providedIn: 'root'
})
export class UploadProvider {
  fileTransfer: FileTransferObject;

  constructor(
    public http: HTTPService,
    public storage: Storage,
    public file: File,
    public transfer: FileTransfer

  ) {

    this.fileTransfer = this.transfer.create();
  }

  public async upload(image: string): Promise<FileUploadResult> {
    const token: string = await this.storage.get('sixideas-token');
    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.png',
      headers: {
        token: token || '5cdbeaaecbc67a69d64b19d6'
      }
    }

    return this.fileTransfer.upload(image, `${ this.http.url }/uploads`, options);
  }

  public async download(): Promise<FileEntry> {
    const file: any = this.fileTransfer.download(this.http.url, this.file.dataDirectory + 'todo');
    return file.toURL();
  }

  public get(id: string): Promise<any> {
    return this.http.get(`uploads/${ id }`);
  }

  public delete(id: string): Promise<any> {
    return this.http.delete(`uploads/${ id }`);
  }
}
