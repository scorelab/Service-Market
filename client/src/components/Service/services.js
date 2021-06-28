import React from 'react';
import MainBlock from '../Common/main-block';
import ShowCase from '../Common/grid';
import { withFirebase } from '../Firebase';

const ServicePage = (props) => (
  <MainBlock>
    <ShowCase />
  </MainBlock>
);


export default withFirebase(ServicePage);