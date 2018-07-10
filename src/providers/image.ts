import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable()
export class ImageProvider {
  constructor(
    public http: SixIdeasHTTPService,
    public transfer: FileTransfer

  ) { }

  public upload(image: string) {
    return this.http.token().flatMap((token: string) => {
      const fileTransfer: FileTransferObject = this.transfer.create();

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'name.png',
        headers: {
          token: token
        }
      }
  
      return fileTransfer.upload(image, `${ this.http.endpoint }/uploads`, options)
    })
  }
}
