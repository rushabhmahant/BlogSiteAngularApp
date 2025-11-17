import { Component, OnInit } from '@angular/core';
import { Blog, BlogService } from '../services/blog-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-blog',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-blog.html',
  styleUrl: './create-blog.css',
})
export class CreateBlog implements OnInit {

  userId: number = 0;
  
  blogId!: number;
  blogName!: string;
  blogCategory!: string;
  blogArticle!: string;
  blogAuthorName!: string;
  createdDate!: string;

  blogForm: FormGroup;

  constructor(private blogService: BlogService, private formBuilder: FormBuilder,
    private router: Router, private activatedRoute: ActivatedRoute) {
      this.blogForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      article: ['', [Validators.required]],
      author: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
      // Check if user is logged in
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        // Redirect to login if not authenticated
        this.router.navigate(['/login']);
        return;
      }

      // Get userId from route parameters
      this.activatedRoute.paramMap.subscribe(params => {
        const userIdParam = params.get('userId');
        console.log('Route params:', params);
        console.log('userId param:', userIdParam);
        if (userIdParam) {
          this.userId = Number(userIdParam);
        } else {
          this.userId = Number(storedUserId);
        }
        console.log('Parsed userId:', this.userId);
      });
    }

    createBlog(){
      if (this.blogForm.valid) {
        const newBlog: Blog = {
          blogId: '',
          blogName: this.blogForm.get('title')?.value,
          blogCategory: this.blogForm.get('category')?.value,
          blogArticle: this.blogForm.get('article')?.value,
          blogAuthorName: this.blogForm.get('author')?.value,
          blogCreationTime: new Date().toISOString()
        };

        this.blogService.createBlog(newBlog, this.userId).subscribe({
          next: (data) => {
            console.log('Blog created successfully:', data);
            alert('Blog created successfully!');
            this.router.navigate(['/blog-list', this.userId]);
          },
          error: (error) => {
            console.error('Error creating blog:', error);
            alert('Failed to create blog. Please try again.');
          }
        });
      } else {
        this.blogForm.markAllAsTouched();
      }
    }

    cancelBlog() {
      if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
        this.router.navigate(['/blog-list', this.userId]);
      }
    }
    
  }

    

