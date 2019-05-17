import { Injectable } from '@angular/core';
import { HTTPService } from '../services/http.service';

import { Storage } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class ImageProvider {
  constructor(
    public http: HTTPService,
    public storage: Storage,
    public transfer: FileTransfer

  ) { }

  public async upload(image: string): Promise<FileUploadResult> {
    const token: string = await this.storage.get('sixideas-token');

    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: `${ new Date().getTime() }.jpg`,
      headers: {
        token: token || '5cdbeaaecbc67a69d64b19d6'
      }
    }

    const transfer: FileUploadResult = await fileTransfer.upload(image, `${ this.http.url }/uploads`, options);
    return transfer
  }
}
