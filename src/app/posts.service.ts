import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class PostsService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}

  createAndStorePosts(title: string, content: string) {
    const postData: Post = { title, content };
    this.http
      .post<{ name: string }>(
        "https://angular-http-3aeff-default-rtdb.firebaseio.com/posts.json",
        postData
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error: Error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>(
        "https://angular-http-3aeff-default-rtdb.firebaseio.com/posts.json"
        // {
        //   headers: new HttpHeaders({ "custom-header": "Hello" }), //ADDING HEADERS
        //   params: new HttpParams().set("print", "pretty  "), //ADDING PARAMS
        //   observe: "response", //GET ALL RESPONSE DATA
        // }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (let key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        })
      );
  }
  deletePosts() {
    return this.http.delete(
      "https://angular-http-3aeff-default-rtdb.firebaseio.com/posts.json"
    );
  }
}
