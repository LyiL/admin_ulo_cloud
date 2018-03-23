import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

export interface ImageType{
  fieldName:string,
  imageUrl:string,
  describe:string
}

/**
 * 图片预览服务类
*/
@Injectable()
export class ULOImagePreviewService{
  private _imagesSource = new Subject<ImageType[]>();
  private _showImageByIndex = new Subject<number>();
  private _showImageViewerSource = new Subject<boolean>();
  private _images:Array<ImageType> = [];

  imagesLoaded$ : Observable<any[]> = this._imagesSource.asObservable();
  showImageByIndex$ : Observable<number> = this._showImageByIndex.asObservable();
  showImageViewerChanged$ : Observable<boolean> = this._showImageViewerSource.asObservable();

  constructor(){
    this.imagesLoaded$.subscribe((images:ImageType[])=>{
      this._images = images;
    });
  }

  loadImages(images: any[]) {
    this._imagesSource.next(images)
  }

  showImageByIndex(newIndex: number) {
    this._showImageByIndex.next(newIndex)
  }

  showImageViewer(show: boolean) {
    this._showImageViewerSource.next(show)
  }

  showImageByFieldName(fieldName:string){
    let _imgIndex = this._images.findIndex((img:ImageType)=>{
      return img.fieldName == fieldName;
    });
    if(_imgIndex != -1){
      this._showImageByIndex.next(_imgIndex);
    }
  }
}
