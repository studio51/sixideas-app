import { Directive, ElementRef, EventEmitter, Input, OnInit, Optional, Output, OnDestroy } from '@angular/core';
import { FormControl, FormControlDirective, FormControlName, NgModel } from '@angular/forms';

import { UserProvider } from 'src/app/providers/user';
import { TagProvider } from 'src/app/providers/tag';

import Tribute, { TributeOptions } from 'tributejs';

@Directive({
  selector: '[appTribute]'
  // exportAs: 'app-tribute'
})
export class TributeDirective<T> implements OnInit, OnDestroy {
  @Input('appTribute') options: TributeOptions<T>;
  @Input() implicitFormControl: FormControl;
  @Output() onMentioned = new EventEmitter<string>();

  tribute: Tribute<T>;

  constructor(
    private element: ElementRef,
    private userProvider: UserProvider,
    private tagProvider: TagProvider,

    @Optional() private fcn: FormControlName,
    @Optional() private fcd: FormControlDirective,
    @Optional() private ngd: NgModel

  ) { }

  get control(): FormControl {
    return this.implicitFormControl || (this.fcn && this.fcn.control) || (this.fcd && this.fcd.control) || (this.ngd && this.ngd.control);
  }

  ngOnInit() {
    const mentions = {
      trigger: "@",
      noMatchTemplate: null,

      values: (text, callback) => {
        this.getUsers(text, tags => callback(tags));
      },

      lookup: function (user) {
        return  "@" + user.username + " - "+ user.name;
      },

      selectTemplate: function (item) {
        return '@' + item.original.username + ' ';
      },

      fillAttr: 'username'
    };

    const hashtags = {
      trigger: "#",
      noMatchTemplate: null,

      values: (text, callback) => {
        this.getTags(text, tags => callback(tags));
      },

      lookup: function (user) {
        return  "@" + user.username + " - "+ user.name;
      },

      selectTemplate: function (item) {
        return '@' + item.original.username + ' ';
      },

      fillAttr: 'username'
    };

    this.options = {
      collection: [mentions, hashtags]
    }

    this.tribute = new Tribute(this.options);
    this.tribute.attach(this.element.nativeElement);

    const el: any = this.element.nativeElement;

    el.addEventListener('tribute-replaced', () => {
      const value: any = ['INPUT', 'TEXTAREA'].includes(el.tagName) ? el.value : el.innerHTML;

      this.onMentioned.emit(value);

      if (this.control) {
        this.control.setValue(value);
      }
    });
  }

  private async getUsers(query, callback) {
    const response: any = await this.userProvider.load(query);

    if (response) {
      callback(response);
    } else {
      callback([]);
    }
  }

  private async getTags(query, callback) {
    const response: any = await this.tagProvider.load(query);

    if (response) {
      callback(response);
    } else {
      callback([]);
    }
  }

  ngOnDestroy() {
    if (this.tribute) {
      this.tribute.detach(this.element.nativeElement);
    }
  }
}