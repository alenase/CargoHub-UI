import React from 'react'

//const Context = React.createContext()

//export default Context
//this indicates that the global store is accessible to all the child tags with MyProvider as Parent

export const MContext = React.createContext();  //exporting context object

class MyProvider extends React.Component {

    state = { modalIsOpenedContext: false }

    render() {
        return (
            <MContext.Provider value={
                {
                    state: this.state,
                    setMessage: (value) => this.setState({
                        message: value
                    })
                }}>
                {this.props.children}
            </MContext.Provider>)
    }
}

export default MyProvider