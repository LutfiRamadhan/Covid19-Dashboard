import React, { useEffect } from 'react';
import IntlMessages from 'util/IntlMessages';
import {FormattedMessage} from 'react-intl';

const Footer = () => {
  useEffect(() => {
    document.getElementById('inevertext').innerHTML = unescape('%44%65%76%65%6c%6f%70%20%62%79%20%4c%75%74%66%69%20%52%61%6d%61%64%68%61%6e%20%26%63%6f%70%79%3b%20%32%30%32%30');
  })
  return (
    <footer className="app-footer">
      <span className="d-inline-block" id="inevertext"><IntlMessages id="component.react.inevertext"/></span>
    </footer>
  );
};

export default Footer;
