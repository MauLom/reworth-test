import React from 'react';

const Reworth = require('@reworthrewards/reworth-directory');  
const { ReworthDirectory } = Reworth;

const PremadeBoard = () => {
    return (
      <ReworthDirectory 
        accentColor={'#ff8a65'} 
        lang={'ES'} 
        fontFamily={'Poppins'} 
      />
    )
}
export default PremadeBoard