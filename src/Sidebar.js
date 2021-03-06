import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import SearchAndFilter from './SearchAndFilter';
import Alert from 'react-bootstrap/Alert';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rangeError: ''
    }
    this.searchAndFilter = new SearchAndFilter();
    this.subject = React.createRef();
    this.interest = React.createRef();
    this.minimumCredits = React.createRef();
    this.maximumCredits = React.createRef();
    this.search = React.createRef();
  }

  setCourses() {
    let error = false;
    if(this.subject.current != null && this.minimumCredits.current != null && this.maximumCredits.current != null && this.interest.current != null) {
      if(this.minimumCredits.current.value.trim() !== '' && this.maximumCredits.current.value.trim() !== '')
        if(this.minimumCredits.current.value > this.maximumCredits.current.value){
          this.setState({rangeError: 'Minimum credit can not be greater than maximum'});
          error = true;
        } else {
          this.setState({rangeError:  null});
        }
      }
      if(!error){
        this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses,this.search.current.value, this.subject.current.value, this.interest.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value));
        this.props.getInterests(this.searchAndFilter.searchAndFilter(this.props.courses,this.search.current.value, this.subject.current.value, this.interest.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value));
      }
  }

  handleCreditsKeyDown(e) {
    if(['0','1','2','3','4','5','6','7','8','9','Backspace','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab'].indexOf(e.key) === -1)
      e.preventDefault();
  }

  getSubjectOptions() {
    let subjectOptions = [];

    for(const subject of this.props.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }

    return subjectOptions;
  }

  
  getInterestOptions() {
    let interestOptions = [];

    for(const interest of this.props.interests) {
        interestOptions.push(<option key={interest}>{interest}</option>);
    }
    return interestOptions;
  }

  getNumberOfCourses(){
    if(this.subject.current != null && this.minimumCredits.current != null && this.maximumCredits.current != null && this.interest.current != null) {
      let courses = this.searchAndFilter.searchAndFilter(this.props.courses,this.search.current.value, this.subject.current.value, this.interest.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value);
      return (
      <Alert variant="info">
        Number of search results: {courses.length}
      </Alert>
      );
    }
  }

  render() {
    return (
      <>
        <Card style={{width: 'calc(20vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 52px)', position: 'fixed'}}>
          <Card.Body>
            <Card.Title>Search and Filter</Card.Title>
            <Form>
            <Form.Group controlId="formKeywords" onChange={() => this.setCourses()} style={{width: '100%'}}>
                <Form.Label>Search</Form.Label>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  <Form.Control type="text" placeholder="keyword search" autoComplete="off" ref={this.search}/>
                </div>
              </Form.Group>



              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control as="select" ref={this.subject} onChange={() => this.setCourses()}>
                  {this.getSubjectOptions()}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="interestArea">
                <Form.Label>InterestArea</Form.Label>
                <Form.Control as="select" ref={this.interest} onChange={() => this.setCourses()}>
                  {this.getInterestOptions()}
                </Form.Control>
              </Form.Group>


              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Form.Group controlId="minimumCredits" onChange={() => this.setCourses()}>
                  <Form.Label>Credits</Form.Label>
                  <Form.Control type="text" placeholder="minimum" autoComplete="off" ref={this.minimumCredits}/>
                </Form.Group>
                <div style={{marginLeft: '5px', marginRight: '5px', marginTop: '38px'}}>to</div>
                <Form.Group controlId="maximumCredits" style={{marginTop: '32px'}} onChange={() => this.setCourses()}>
                  <Form.Control type="text" placeholder="maximum" autoComplete="off" ref={this.maximumCredits}/>
                </Form.Group>
              </div>
              <div style={{color: 'red'}}>{this.state.rangeError}</div>
            </Form>
            <br></br>
            <div>
              {this.getNumberOfCourses()}
            </div>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default Sidebar;
