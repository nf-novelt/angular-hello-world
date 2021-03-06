import { PostService } from './../services/post.service';
import { Component, OnInit } from '@angular/core';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadInput } from '../common/bad-input';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts:any[];  

  constructor(private service: PostService) {
    
  }

  createPost(input: HTMLInputElement) {
    let post = { title: input.value }
    //Add the post object at the top of this.posts.
    //To add it at the end, use push()
    this.posts.splice(0, 0, post);
    
    input.value = '';

    this.service.create(post)
      .subscribe(
        response => {
          post['id'] = response.id;
          
          console.log(response);
      },
        (error: AppError) => {
          //Rollback
          this.posts.splice(0, 1);

          if(error instanceof BadInput) {            
            alert('This post has already been deleted');
            //or for example: this.form.setErrors(error.originalError);
          }
          else throw error;
        }
    )
  }
  
  updatePost(post) {    
    this.service.update(post)
    .subscribe(
      updatedPost => {      
        console.log(updatedPost);
      })
  }

  deletePost(post) {
    let index = this.posts.indexOf(post);
    this.posts.splice(index, 1);

    this.service.delete(post.id)
      .subscribe(
        null,
        (error: AppError) => {
          if(error instanceof NotFoundError) {
            this.posts.splice(index, 0, post);

            alert('This post has already been deleted');
            //or for example: this.form.setErrors(error.json());
          }
          else throw error;
      })
  }

  ngOnInit() {
    this.service.getAll()
    .subscribe(
      posts => this.posts = posts
    )
  }

}
