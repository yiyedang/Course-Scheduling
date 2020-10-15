import React from 'react';
import './App.css';
import CompletedCourse from './CompletedCourse';

class CompletedCourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (Array.isArray(this.props.data)){
      for(let i =0; i < this.props.data.length; i++){
        courses.push (
          <CompletedCourse key={i} data={this.props.data[i]} updateRatedCourse={this.props.updateRatedCourse} updateRecommendedCourse={this.props.updateRecommendedCourse}/>
        )
      }
    }
    else{
      for(const course of Object.keys(this.props.data)){
        courses.push (
          <CompletedCourse key={this.props.data[course].number} data={this.props.data[course]} updateRatedCourse={this.props.updateRatedCourse} updateRecommendedCourse={this.props.updateRecommendedCourse}/>
        )
      }
    }
  
    return courses;
  }
  
  shouldComponentUpdate(nextProps) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }
  
  render() {
    return (
      <div style={{margin: 5, marginTop: -5}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default CompletedCourseArea;