import React from 'react'
import Library from "switch2"

export default function App(){
  return (
    <React.Fragment>
      <h1>This is an Example project for Library development</h1>
      <Library id={1} />
      <Library id={2} />
    </React.Fragment>
  ) 
}