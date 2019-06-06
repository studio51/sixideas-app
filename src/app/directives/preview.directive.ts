import { Directive, ElementRef, EventEmitter, Input, OnInit, Optional, Output, OnDestroy } from '@angular/core';
import { FormControl, FormControlDirective, FormControlName, NgModel } from '@angular/forms';

import { ToastController } from '@ionic/angular';

import { PreviewProvider } from '../providers/preview';
import { PreviewResponse } from '../interfaces/preview.response';

import * as getURLs from 'get-urls';

@Directive({
  selector: '[appPreview]'
})
export class PreviewDirective<T> implements OnInit, OnDestroy {
  @Input('appPreview') options: any;
  @Input() implicitFormControl: FormControl;
  @Output() onPreviewed = new EventEmitter<string>();

  private cache: any = {};

  constructor(
    public element: ElementRef,
    public previewProvider: PreviewProvider,
    public toastCtrl: ToastController,

    @Optional() private fcn: FormControlName,
    @Optional() private fcd: FormControlDirective,
    @Optional() private ngd: NgModel

  ) { }

  get control(): FormControl {
    return this.implicitFormControl || (this.fcn && this.fcn.control) || (this.fcd && this.fcd.control) || (this.ngd && this.ngd.control);
  }

  async ngOnInit() {
    const el: any = this.element.nativeElement;

    el.addEventListener('keydown', async () => {
      const value: any = ['INPUT', 'TEXTAREA'].includes(el.tagName) ? el.value : el.innerHTML;
      const URLs: any = getURLs(value);

      if (URLs.size > 0) {
        Array.from(URLs).forEach((url: string) => this.previewURL(url));
      }

      this.onPreviewed.emit(this.cache);
      this.autoSize(el);
    });
  }

  private async previewURL(url: string) {
    if (!this.cache[url]) {
      const toast: any = await this.toastCtrl.create({
        message: 'Found a URL, generating preview..'
      });

      toast.present();

      this.cache[url] = {};
      this.cache[url]['previewed'] = this.cache[url]['previewed'] || false;

      if (!this.cache[url]['previewed']) {
        const response: PreviewResponse = await this.previewProvider.get(url);

        if (response) {
          this.cache[url]['previewed'] = true;
          Object.assign(this.cache[url], response);

          setTimeout(() => { toast.dismiss() }, 2000);
        }
      }
    }
  }

  private autoSize(el: any) {
    setTimeout(() => {
      el.style.cssText = 'height: auto; padding: 0';
      el.style.cssText = 'height: ' + el.scrollHeight + 'px';
    }, 0);
  }

  ngOnDestroy() { }
}