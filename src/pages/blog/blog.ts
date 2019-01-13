import { Component } from '@angular/core';
import {BlogPost} from "../../models/blog-post.models";
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-blog',
  templateUrl: 'blog.html'
})
export class BlogPage {
	private blog: BlogPost
	
	constructor(public navCtrl: NavController, private navParams:NavParams) {
		this.blog = this.navParams.get('blog');
	}
	
}
