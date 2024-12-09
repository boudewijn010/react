
import PropTypes from 'prop-types';

function UserGreeting(props) {

    const welkommessage =   <h2 className='welkom-message'>Welcome back, {props.username}!</h2>;
    const loginprompt =     <h2 className='login-prompt'>Please log in.</h2>;

    return (props.isLoggedIn ? welkommessage : loginprompt);
                                
}

UserGreeting.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired
};

UserGreeting.defaultProps = {
    isLoggedIn: false,
    username: "Guest"
};

export default UserGreeting;