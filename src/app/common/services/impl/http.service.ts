import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/shareReplay";
import {HttpClient, HttpHeaders, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {CommonEnumConst} from "./common.enum.const";
import {LoadingService} from "../../components/loading/loading.service";

@Injectable()
export class HttpService{
  private headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });

  constructor(private http:HttpClient,private loadingService:LoadingService){
  }

  /**
   * post请求
   * @param url
   * @param params
   * @returns {Observable<R|T>}
   */
  public post(url:string,params:any={}):Observable<any>{
    if(params['_reqModel'] == 'query'){
      sessionStorage.setItem(CommonEnumConst.QUERY_PARAMS_STORAGE_KEY+'_'+params['_reqFormName'],JSON.stringify(params));
    }
    if(_.size(params) > 0){
      params = this.filterPrivateParam(params);
      params = this.trimParam(params);
    }

    return this.request(url,params).catch(this.httpReqError);
  }

  /**
   * get请求
   * @param url
   * @param params
   * @returns {Observable<Response>}
   */
  public get(url:string,params:any={}):Observable<any>{
    if(_.size(params) > 0){
      params = this.filterPrivateParam(params);
      params = this.trimParam(params);
      url += url.indexOf('?') != -1 ? '&'+jQuery.param(params) : '?'+jQuery.param(params);
    }
    return this.request(url,params,'get').catch(this.httpReqError);
  }

  public request(url:string,params:any,method:string='post',responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json',observe:'body' | 'events' | 'response' = 'body'):Observable<any>{
    this.loadingService.show();

    let reqOptions = {
      headers:this.headers,
      reportProgress:true,
      responseType:responseType,
      observe:observe
    };
    if(method == 'post'){
      reqOptions['body'] = params;
    }else if(method == 'get'){
      let _params = new HttpParams();
      for(let key in params){
        _params.set(key,params[key]);
      }
      reqOptions['params'] = _params;
    }

    return this.http.request(method,url,reqOptions).map(res=>{
      this.loadingService.hide();
      return res;
    }).shareReplay();
  }

  /**
   * 文件下载
   * @param url
   * @param params
   * @returns {Observable<R>} responseType: ResponseContentType.Blob
   */
  public download(url:string,params:any={}):Observable<any>{
    if(_.size(params) > 0){
      params = this.filterPrivateParam(params);
      params = this.trimParam(params);
    }
    return this.request(url,params,'post','blob','response').catch(this.httpReqError).map((res)=>{
      let blob = res.body;
      if(blob.type == 'application/json'){
        let reader = new FileReader();
        reader.readAsText(blob);
        return reader;
      }else{
        let contentDisposition = res.headers.get('content-disposition');
        let fileName:string='';
        if(contentDisposition){
          fileName = contentDisposition.replace(/.*filename\=\"(.*)+\"/,'$1');
          fileName = decodeURIComponent(fileName);
        }
        return {blob:blob,fileName:fileName};
      }
    });
  }

  private httpReqError(res:HttpErrorResponse):Observable<any>{
    console.log(res);
    console.error('message:',res['message'],'  error:',res['error']);
    this.loadingService.hide();
    return Observable.throw(res['message']);
  }

  private filterPrivateParam(data:any){
    if(!data){
      return data;
    }
    if(data instanceof Array){
      data.forEach((_data,ind)=>{
        if(_.size(_data) > 0) {
          data[ind] = this.filterPrivateParam(_data);
        }
      });
      return data;
    }else{
      let newData:any = {};
      for(let key in data){
        if(key.indexOf('_') == -1){
          newData[key] = data[key];
        }
      }
      return newData;
    }
  }

  /**
   * 去除参数里的空格
   * @param data
   * @returns {any}
   */
  private trimParam(data:any){
    if(!data){
      return data;
    }
    if(_.size(data) > 0){
      for(let item in data){
        //值为时间对象时Object.prototype.toString.call(data[item]) === "[object Date]"，不做处理
        switch(Object.prototype.toString.call(data[item])){
          case "[object String]":  //字符串类型
            data[item] = data[item].trim()
            break;
          case "[object Array]": //数组类型
          case "[object Object]": //对象类型
            data[item] = this.trimParam(data[item])
            break;
          default://(其他类型:)number date function undefined boolean null 类型跳过不做处理
            break;
        }
      }
      return data;
    }
  }

}
