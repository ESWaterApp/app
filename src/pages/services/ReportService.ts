import {Injectable} from "@angular/core";
@Injectable()
export class ReportService {
  private _Userid: string;
  private _Location: string;
  private _Datetime: string;
  private _ImageURL: string;
  private _ImageID: string;
  private _Status: string;
  private _Solved: boolean;
  private _Deleted: boolean;
  private _Comments: string;
  private _Authority: string;
  private _has_reported: boolean;
  constructor() {
    this._Status = "Unassigned";
    this._Solved = false;
    this._Deleted = false;
    this._has_reported = false;
  }
  getUserid() {
    return this._Userid;
  }
  setUserid(userid: string) {
    this._Userid = userid;
  }
  setLocation(locName: string) {
    this._Location = locName;
  }
  setDatetime(datetime: string) {
    this._Datetime = datetime;
  }
  setImageURL(imageURL: string) {
    this._ImageURL = imageURL;
  }
  getImageURL() {
    return this._ImageURL;
  }
  setImageId(imageID: string) {
    this._ImageID = imageID;
  }
  setComments(comments: string) {
    this._Comments = comments;
  }
  setAuthority(authority: string) {
    this._Authority = authority;
  }
  get has_reported(): boolean {
    return this._has_reported;
  }
  set has_reported(has_reported: boolean) {
    this._has_reported = has_reported;
  }
  toJSON() : {} {
    return {"User": this._Userid, "Location": this._Location, "Datetime": this._Datetime, "ImageID": this._ImageID, "Status": this._Status, "Solved": this._Solved, "Deleted": this._Deleted, "Comments": this._Comments, "Authority": this._Authority};
  }
}
