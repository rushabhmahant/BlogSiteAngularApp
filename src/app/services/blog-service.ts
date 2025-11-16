import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Blog {
  blogId: string;
  blogName: string;
  blogCategory: string;
  blogArticle: string;
  blogAuthorName: string;
  blogCreationTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {

  private apiUrl = 'http://localhost:8080/api/v1/blogsite';

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blog/${id}`);
  }

  getBlogsByUserId(userId: number): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/blog/user/${userId}`);
  }

  createBlog(blog: Blog, userId: number): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/user/blog/add/${userId}`, blog, this.getHttpOptions());
  }

  updateBlog(id: number, blog: Partial<Blog>): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, blog, this.getHttpOptions());
  }

  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/blog/${id}`);
  }
  
}
