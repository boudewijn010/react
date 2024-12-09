
import PropTypes from 'prop-types';

function Student(props) {
  return (
    <div className="student">
      <p>Name: {props.name} </p>
        <p>Age: {props.age} </p>
        <p>Is Student: {props.isStudent ? "yes" : "no"} </p>
    </div>
  );
}

Student.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  isStudent: PropTypes.bool.isRequired,
};
Student.defaultProps = {
    name: "Guest",
    age: 0,
    isStudent: false,
    };

export default Student;