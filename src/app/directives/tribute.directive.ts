import { Directive, ElementRef, EventEmitter, Input, OnInit, Optional, Output, OnDestroy } from '@angular/core';
import { FormControl, FormControlDirective, FormControlName, NgModel } from '@angular/forms';

import { Tag } from '../interfaces/tag';
import { User, UserResponse } from '../interfaces/user';

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
    this.options = {
      collection: [this.mentions, this.tags]
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

  private get tags(): any {
    return {
      trigger:  '#',
      fillAttr: 'display_text',

      values: (text: string, callback: Function) => this.getTags(text, tags => callback(tags)),
      lookup: (tag: Tag) => tag.display_text,
      selectTemplate: (item: any) => item.original.display_text
    }
  }

  private get mentions(): any {
    return {
      trigger:  '@',
      fillAttr: 'username',

      values: (text: string, callback: Function) => this.getUsers(text, tags => callback(tags)),
      lookup: (user: User) => `@ ${ user.username } - ${ user.name }`,
      selectTemplate: (item: any) => `@ ${ item.original.username } `,
    };
  }

  private async getUsers(query: string, callback: Function) {
    const params: any = {};
          params['page'] = 1;
          params['limit'] = 5;
          params['q'] = query;

    const response: UserResponse = await this.userProvider.load(params);

    if (response.users) {
      callback(response.users);
    } else {
      callback([]);
    }
  }

  private async getTags(query: string, callback: Function) {
    const params: any = {};
          params['page'] = 1;
          params['limit'] = 5;
          params['q'] = query;

    const response: any = await this.tagProvider.load(params);

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