import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/*
  Add the template content to the DOM unless the condition is true.
  If the expression assigned to `ngUnless` evaluates to a truthy value then the
  templated elements are removed removed from the DOM, else, the templated
  elements are (re)inserted into the DOM.
  <div *ngUnless="errorCount" class="success">
    Congrats! Everything is great!
  </div>
  ### Syntax
  <div *ngUnless="condition">...</div>
  <div template="ngUnless condition">...</div>
  <template [ngUnless]="condition"><div>...</div></template>
*/

@Directive({
  selector: '[ngUnless]'
})

export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef

  ) { }

  @Input() set ngUnless(condition: boolean) {

    if (!condition && !this.hasView) {

      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;

    } else if (condition && this.hasView) {

      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}