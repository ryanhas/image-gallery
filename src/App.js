import React from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimateSharedLayout } from 'framer-motion';

const imageSize = 250;
const modalSize = 550;
const id1 = uuidv4();
const id2 = uuidv4();
const id3 = uuidv4();
const id4 = uuidv4();
const links = [
  {
    id: id1,
    url: `https://picsum.photos/seed/${id1}/${imageSize}`,
  },
  {
    id: id2,
    url: `https://picsum.photos/seed/${id2}/${imageSize}`,
  },
  {
    id: id3,
    url: `https://picsum.photos/seed/${id3}/${imageSize}`,
  },
  {
    id: id4,
    url: `https://picsum.photos/seed/${id4}/${imageSize}`,
  }
];

function Image(props) {
  const removeImage = () => {
    props.removeItem(props.link.id)
  }

  const displayModal = () => {
    props.displayModal(props.link.id)
  }
  
  return (
  <motion.div whileHover={{ opacity: 1, scale:1.1 }} layout className="image">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <img
          alt="Loading ..."
          onClick={displayModal}
          src={props.link.url}
        />
        <button className="remove" onClick={removeImage}>X</button>
      </motion.div>
      
      
  </motion.div>
  )
}


class ImageGallery extends React.Component {
  
  removeItem = (item) => {
    this.props.removeItem(item)
  }

  addImage = () => {
    const id = uuidv4();
    this.props.addImage(id)
  }

  displayModal = (id) => {
    this.props.displayModal(id)
  }
  
  render() {
    return (
      <AnimateSharedLayout>
        <motion.div layout className='gallery'>
          <button className='addButton' onClick={this.addImage}>Load new Image</button>
          <motion.div layout className='imageGrid'>
            {this.props.links.map((link) => {
            return <Image 
              key={link.id}
              removeItem={this.removeItem} 
              displayModal={this.displayModal} 
              link={link} 
            />
          })}
          </motion.div>
        </motion.div>
      </AnimateSharedLayout>
      
      
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links,
      modal: null
    }
  }

  componentDidMount() {
    if (localStorage.getItem('app-state-links')) {
      const savedLinks = JSON.parse(localStorage.getItem('app-state-links'))
      this.setState({
        links: savedLinks
      })
    }
  }

  componentDidUpdate() {
    localStorage.setItem('app-state-links', JSON.stringify(this.state.links));
  }

  removeItem = (itemId) => {
    const newLinks = this.state.links.filter((link) => {
      return link.id !== itemId
    })
    this.setState({
      links: newLinks
    })
  }

  addImage = (id) => {
    const item ={
      id,
      url: `https://picsum.photos/seed/${id}/${imageSize}`,
    }
    this.setState((prevState) => {
      const newLinks = [item, ...prevState.links]
      return { 
        links: newLinks
      };
    });
  }

  displayModal = id => {
    this.setState({
      modal: id
    })
  }

  dismissModal = () => {
    this.setState({
      modal: null
    })
  }

  render() {
    return (
      <>
      <h1>My Image Gallery</h1>
      <p>Create your personal image gallery with random photos from the Lorem Picsum API</p>
      {this.state.modal && 
          <div className='modal' onClick={this.dismissModal}>
            <img
              alt="Loading ..."
              src={`https://picsum.photos/seed/${this.state.modal}/${modalSize}`}/>
          </div>}
          
      <ImageGallery
        addImage={this.addImage} 
        removeItem={this.removeItem}
        displayModal={this.displayModal}
        links={ this.state.links }
      />
      </>
      
    );
  }
}

export default App