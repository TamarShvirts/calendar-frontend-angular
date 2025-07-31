import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentService } from '../../../comment.service';

// interface Comment {
//   comments: string;
//   commentDate: string;
//   dateByCalendar: string;
// }

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {

  comments: any;
  newComment: string = '';
  commentId: any;
  @ViewChild('commentInput') commentInput!: ElementRef;   




constructor(public dialogRef: MatDialogRef<CommentsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { date: Date},
  private commentService: CommentService
  ){
  //   if (data && data.comments) {
  //   this.comments = data.comments;
  // }
}

ngOnInit(): void {
  this.loadComments();
}


loadComments(){

  this.commentService.getCommentsByDate(this.data.date).subscribe(
    response => {
      console.log('successfully:', response);
      this.comments = response;
      this.comments.reverse();
      console.log(this.comments, "this.");
      
    },
    error => {
      console.log('Error:', error);
    }
  );

}

addComment() {
  if (this.newComment.trim()) {
    this.comments.unshift({
      comments: this.newComment,
      commentDate: new Date().toISOString(),
      dateByCalendar: new Date(this.data.date.getTime() - this.data.date.getTimezoneOffset() * 60000).toISOString()
    });
    this.newComment = '';
    console.log(this.comments[0],"comment");
    
    this.commentService.Updatecomment(this.comments[0]).subscribe(
      response => {
        console.log('successfully', response);
        this.commentId=response.commentId;
        this.comments[0].commentId=this.commentId;
      },
      error => {
        console.log('Error', error);
      }
    );
    
    if (this.commentInput?.nativeElement) {
      const textarea = this.commentInput.nativeElement;
      textarea.focus();
      textarea.setSelectionRange(0, 0);
    }

    setTimeout(() => {
      const container = document.querySelector('.comments-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);

  }

}

onKeyDown(event: KeyboardEvent) {
  if (event.shiftKey && event.key === 'Enter') {
    event.preventDefault(); // מונע שליחה
    this.newComment += '\n'; // מוסיף שורה חדשה
  } else if (event.key === 'Enter') {
    event.preventDefault(); // מונע הפעלת ברירת מחדל
    this.addComment(); // שולח תגובה


    if (this.commentInput?.nativeElement) {
      const textarea = this.commentInput.nativeElement;
      textarea.focus();
      textarea.setSelectionRange(0, 0);
    }
  }
}


// מחיקת הערה
commentDel(commentId: number) {

  this.commentService.deleteComment(commentId).subscribe(
    response => {
      console.log('successfully', response);
      this.comments = this.comments.filter((d: any) => d.commentId !== commentId);
    },
    error => {
      console.log('Error', error);
    }
  );
}





onNoClick(): void {
  this.dialogRef.close(this.comments);
}

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  onCancel(): void {
    this.dialogRef.close();
  }
}
