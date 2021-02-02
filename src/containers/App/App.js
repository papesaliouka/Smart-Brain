import React, {Component} from 'react';
import Navigation from '../../components/Navigation/Navigation';
import Logo from '../../components/Logo/Logo';
import '../../containers/App/App.css';
import ImageLinkForm from '../../components/ImageLinkForm/ImageLinkForm';
import './App.css';
import Rank from '../../components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from '../../components/FaceRecognition/FaceRecognition';
import SignIn from '../../components/SignIn/SignIn';
import Register from '../../components/Register/Register';

const app = new Clarifai.App({apiKey: 'db49ef4d004b4846a3fcb9163848d0b6'})


const particlesOptions = {
	particles: {
		number: {
			value: 80,
			density:{
				enable: true,
				value_area: 800,
			}
		}
	}
}



class App extends Component {
	constructor (){
		super()
		this.state={
			input:'',
			imageUrl:'',
			box: {},
			route: 'signin',
			isSignedIn: false
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box ;
		console.log(clarifaiFace);
		const image= document.getElementById('Inputimg')
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: width * clarifaiFace.left_col ,
			topRow:  height * clarifaiFace.top_row ,
			rightCol: width - (clarifaiFace.right_col * width) ,
			bottomRow: height - (clarifaiFace.bottom_row * height)
		}
	}


	displayFaceBox = (box) => {
		this.setState({box:box});
		console.log(box);
	}


	onInputChange = (event) => {this.setState({input: event.target.value})}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		app.models
		.predict(
			'f76196b43bbd45c99b4f3cd8e8b40a8a', 
			this.state.input)
		.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
		.catch(err => console.log(err));
}
	onRouteChange = (route) => {
		if (route=== 'signout') {
			this.setState({isSignedIn: false})
		}else if (route==='home'){
			this.setState({isSignedIn: true})
		}
		this.setState({route: route})
	}

	render() {
		const {box, route, imageUrl} = this.state
		return(
			<div className= 'App'>
				<Particles className= 'particles'
					params = {particlesOptions}
				/>
				<Navigation onRouteChange={this.onRouteChange}/>
				{route==='home' 
				? <div>
						<Logo/>
						<Rank/>
						<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
						<FaceRecognition box={box} imageUrl={imageUrl}/>
					</div> 
				: (

					route === 'signin' 
					? <SignIn onRouteChange={this.onRouteChange}/>
					: <Register isSignedIn={this.isSignedIn} onRouteChange={this.onRouteChange}/>
				)
	
				}
			</div>
		);
	}
}



export default App;