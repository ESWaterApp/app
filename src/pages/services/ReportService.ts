import {Injectable} from "@angular/core";
@Injectable()
export class ReportService {
  private _Userid: string;
  private _Location: {};
  private _ImageID: string;
  private _Status: string;
  private _Solved: boolean;
  private _Deleted: boolean;
  private _Comments: string;
  constructor() {
    this._Status = "Unassigned";
    this._Solved = false;
    this._Deleted = false;
  }
  setUserid(userid: string) {
    this._Userid = userid;
  }
  setLocation(loc: {}) {
    this._Location = JSON.parse(JSON.stringify(loc));
  }
  setImageId(imageID: string) {
    this._ImageID = imageID;
  }
  setComments(comments: string) {
    this._Comments = comments;
  }
  
  toJSON() : {} {
    return {"User": this._Userid, "Location": this._Location, "ImageID": this._ImageID, "Status": this._Status, "Solved": this._Solved, "Deleted": this._Deleted, "Comments": this._Comments};
  }
}
