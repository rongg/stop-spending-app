import React from "react";
import '../styles/footer.css';

const Footer = ({user}) => {
    return (
        <footer className="page-footer font-small blue pt-4">
            <div className="footer-copyright text-center py-3">© 2020 Copyright:
                <a href="https://stop-spending-app.herokuapp.com/"> stop-spending.com</a>
            </div>

        </footer>
    );
};

export default Footer;
