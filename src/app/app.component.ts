import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  @ViewChild('imagePreview') imagePreview!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('img') img!: ElementRef;

  public imageForm!: any;
  public imageSrc!: any;
  public animations: string[] = ['Without animation', 'With animation'];

  public anim = `
    #img {
      width: 100px;
      height: 100px;
      background-color: red;
      position: relative;
      animation-name: example;
      animation-duration: 4s;
      animation-delay: 2s;
    }
    
    @keyframes example {
      0%   {left:0px; top:0px;}
      25%  {left:200px; top:0px;}
      50%  {left:200px; top:200px;}
      75%  {left:0px; top:200px;}
      100% {left:0px; top:0px;}
    }
  `

  constructor(private formBuilder: FormBuilder){
    this.imageForm = this.formBuilder.group({
      image: ['', [Validators.required]],
      animation: [''],
      width: ['500'],
      height: ['500'],
      containerWidth: ['500'],
      containerHeight: ['500'],
      imagePositionX: ['0'],
      imagePositionY: ['0'],
    });

    this.imageForm.valueChanges.subscribe(() => {
      this.changeImgProps();
    })
  }

  get image() {
    return this.imageForm.get('image');
  }
 
  get animation() {
    return this.imageForm.get('animation');
  }
 
  get width() {
    return this.imageForm.get('width');
  }
 
  get height() {
    return this.imageForm.get('height');
  }

  get containerWidth() {
    return this.imageForm.get('containerWidth');
  }
 
  get containerHeight() {
    return this.imageForm.get('containerHeight');
  }

  get imagePositionX() {
    return this.imageForm.get('imagePositionX');
  }

  get imagePositionY() {
    return this.imageForm.get('imagePositionY');
  }

  public onSubmit() {
    if (this.imagePreview && this.img) {
      let data = this.imagePreview.nativeElement.innerHTML;

      const style = document.createElement("style")

      if (this.animation.value === 'With animation') {
        style.textContent = this.anim;
      }

      let html = `
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Image</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
            ${style.innerHTML}
          </style>
        </head>
        <body>
          ${data}
        </body>
        </html>      
      `

      const blob = new Blob([html], { type: 'text/html' });

      let a = document.createElement("a"),
          url = URL.createObjectURL(blob);
      a.href = url;
      a.download = 'image';
      document.body.appendChild(a);
      document.body.insertAdjacentHTML("beforeend", `<style>body{background:red}</style>`)
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
    }
  }

  public readURL(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (target && target.files && target.files[0]) {
      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = () => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }
  }

  public changeImgProps(): void{
    let imgNative = this.img.nativeElement;
    let containerNative = this.container.nativeElement;

    const style = document.createElement("style")

    if (this.animation.value === 'With animation') {
      style.textContent = this.anim;
      document.head.appendChild(style)
    }

    imgNative.style.width = this.width.value + 'px';
    imgNative.style.height = this.height.value + 'px';
    imgNative.style.transform = `translate(${this.imagePositionX.value}px, ${this.imagePositionY.value}px)`

    containerNative.style.width = this.containerWidth.value + 'px';
    containerNative.style.height = this.containerHeight.value + 'px';
  }
}
