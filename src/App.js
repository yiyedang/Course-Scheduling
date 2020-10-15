import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CompletedCourseArea from './CompletedCourseArea';
import RecommendedCourseArea from './RecommendedCourseArea';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      completedCourses: [],
      subjects: [],
      interests: [],
      cartCourses: {},
      ratedCourses: {},
      recommendedCourses: {},
      interestWeight: {}
    };
  }

  componentDidMount() {
   this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json();
    let completedURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let completed = await(await fetch(completedURL)).json();
    let completedData = completed.data;
    // console.log(completedData);
    this.setState({allCourses: courseData, filteredCourses: courseData, completedCourses: completedData, subjects: this.getSubjects(courseData), interests: this.getInterests(courseData)});
  }

  getCompletedData(){
    let completed = [];
    for(const i of Object.keys(this.state.completedCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === this.state.completedCourses[i]})
      completed.push(course);
    }
    return completed;
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getInterests(data){
    let newArr = [];
    newArr.push("All");
    
    for(let i = 0; i < data.length; i++) {
      let keywords = data[i].keywords;
      for(let j = 0; j < keywords.length; j++){
        if(newArr.indexOf(keywords[j]) === -1)
        newArr.push(keywords[j]);
      }
      if(newArr.indexOf(data[i].subject) === -1)
        newArr.push(data[i].subject);
    }

    this.setState({interests: newArr});
    return newArr;
  }

  getCourseByNumber = (courseNumber) => {
    for(const course of Object.values(this.state.allCourses)){
      if(course.number === courseNumber){
        return course;
      }
    }
  }

  getRecommendedData(){
    let recommendedData= [];
    for(const courseKey of Object.keys(this.state.recommendedCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey});
      recommendedData.push(course);
    }
    return recommendedData;
  }

  updateRecommendedCourse(){
    let recommended = {};
    let weights = [];
    for(const courseKey of Object.keys(this.state.ratedCourses)) {
      if(this.state.ratedCourses[courseKey] === 'No Rating'){ continue; }
      let score = parseInt(this.state.ratedCourses[courseKey], 10);
      let completedCourse = this.state.allCourses.find((x) => {return x.number === courseKey});
      let completedsubject = completedCourse.subject;
      let completedkeywords = completedCourse.keywords;
      
      // if the course is highly rated
      if(score >= 3){
        if(!(completedsubject in weights)){
          weights[completedsubject] = 0;
        }
        weights[completedsubject] += 1;
        for(let i = 0; i < completedkeywords.length; i++){
          if(!(completedkeywords[i] in weights)){
            weights[completedkeywords[i]] = 0;
          }
          weights[completedkeywords[i]] += 1;
        }
      } else {
        if(completedsubject in weights){
          weights[completedsubject] -= 1;
        }
        for(let i = 0; i < completedkeywords.length; i++){
          if(completedkeywords[i] in weights){
            weights[completedkeywords[i]] -= 1;
          }
        }
      }
    }
    
    for(const course of Object.values(this.state.allCourses)){
      let courseNumber = course.number;
      let subject = course.subject;
      let keywords = course.keywords;
      if(subject in weights && weights[subject] > 0){
        if(!(courseNumber in this.state.ratedCourses) && !(courseNumber in recommended)){
          recommended[courseNumber] = subject;
        }
      } else {
        for(let j = 0; j < keywords.length; j++){
          if(keywords[j] in weights && weights[keywords[j]] > 0){
            if(!(courseNumber in this.state.ratedCourses) && !(courseNumber in recommended)){
              recommended[courseNumber] = keywords[j];
            }
          }
        }
      }
    }
    // console.log(recommended);
    this.setState({interestWeight: weights});
    this.setState({recommendedCourses: recommended});
  }

  updateRatedCourse(courseKey, score){
    let rated = this.state.ratedCourses;
    rated[courseKey] = score;
    this.setState({ratedCourses: rated});
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})
      //console.log(course);
      cartData.push(course);
    }
    return cartData;
  }

  render() {

    return (
      <>
        <link
           rel="stylesheet" 
           href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" 
           integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" 
           crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} getInterests={(data) => this.getInterests(data)} courses={this.state.allCourses} subjects={this.state.subjects} interests={this.state.interests}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} completed={this.state.completedCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.getCartData()} completed={this.state.completedCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CompletedCourseArea data={this.getCompletedData()} updateRatedCourse={(key, value) => this.updateRatedCourse(key, value)} updateRecommendedCourse={() => this.updateRecommendedCourse()}/>
            </div>
          </Tab>
          <Tab eventKey="recommend" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <RecommendedCourseArea data={this.getRecommendedData()} recommended={this.state.recommendedCourses} getCourseByNumber={this.getCourseByNumber}/>
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
