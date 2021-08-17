import React from 'react'

type myProps = {
  id : number
}

export default function Library(props: myProps) {
  return (
    <p>This is a library Component, ID : { props.id }</p>
  )
}