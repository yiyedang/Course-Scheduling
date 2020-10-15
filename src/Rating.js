import React from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.rating = React.createRef();
  }

  setRating = (score) => {
    if(this.rating.current != null) {
      this.props.updateRatedCourse(this.props.courseKey, score);
      this.props.updateRecommendedCourse();
    }
  }


  render() {
    return (
      <>
        <Form>
            <Form.Control as="select" ref={this.rating} onChange={(event) => this.setRating(event.target.value)}>
            <option value="0">No Rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            </Form.Control>
        </Form>
      </>
    )
  }
}

export default Rating;