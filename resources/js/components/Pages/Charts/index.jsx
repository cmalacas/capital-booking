import React, {Component, Fragment} from 'react';

import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';

export default class Charts extends Component {

  constructor(props) {

    super(props);

  }

  render() {

    return (

      <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">                    
                </div>
                <AppFooter/>
            </div>
        </div>
      </Fragment>

    )

  }

}