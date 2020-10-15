import React from 'react';
import './App.css';
import RecommendedCourse from './RecommendedCourse';

class RecommendedCourseArea extends React.Component {
    render() {
        
        return (
            <div style={{margin: 5, marginTop: -5}}>
                {Object.keys(this.props.recommended).map((courseNumber) => {
                    let course = this.props.getCourseByNumber(courseNumber);
                    return <RecommendedCourse key={course.number} data={course} 
                    interest={this.props.recommended[courseNumber]}/>;
                    }
                )}
            </div>
        )
    }
}

export default RecommendedCourseArea;