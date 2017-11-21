import React from 'react'

let Header = () => {
  return (
    <div className="header z1">
      <div>
        <i className="fa fa-bar-chart" />
        <span style={{ marginLeft: 5 }}>DATA PORTAL</span>
      </div>
      <a href="https://github.com/NCI-GDC/portal-graphql" target="_blank">
        <i style={{ float: 'right', fontSize: 25 }} className="fa fa-github" />
      </a>
    </div>
  )
}

export default Header
