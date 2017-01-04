Meteor.startup(function(){
	var famous = require('famous');
	// Famous dependencies
	//var DOMElement = famous.domRenderables.DOMElement;
	var FamousEngine = famous.core.FamousEngine;
	// Initialize the FamousEngine to start the rendering process
	FamousEngine.init();
	var clock = FamousEngine.getClock();
	function waitForDOMElementFromNodePromise(node) {
		return new Promise(function (resolve) {
			(function query() {
				var nodeId = node.getLocation();
				var elements = document.querySelector(nodeId.split('/')[0]).querySelectorAll('[data-fa-path]');
				for (var i = 0; i < elements.length; ++i) {
					if (elements[i].dataset.faPath === nodeId) {
						return resolve(elements[i]);
					}
				}
				clock.setTimeout(query, 16);
			})();
		});
	}
	// Create a scene for the FamousEngine to render
	var scene = FamousEngine.createScene('body');
	var rootNode = scene.addChild();
	rootNode.setSizeMode('absolute', 'absolute', 'absolute')
		.setAbsoluteSize(300, 300);
// add DOM element component with content
	rootNode.setAlign(0.5,0.5);
	waitForDOMElementFromNodePromise(rootNode)
		.then(function(element){
			Blaze.render(Template.login, element);
		});

	var Transitionable = famous.transitions.Transitionable;

	// A component that will animate a node's position in x.
	function Animation (node) {
		// store a reference to the node
		this.node = node;
		// get an id from the node so that we can update
		this.id = node.addComponent(this);
		// create a new transitionable to drive the animation
		this.xPosition = new Transitionable(100);
	}

	Animation.prototype.start = function start () {
		// request an update to start the animation
		this.node.requestUpdate(this.id);
		// begin driving the animation
		this.xPosition.from(100).to(300, 'easeIn', 1000);
	};

	Animation.prototype.onUpdate = function onUpdate () {
		// while the transitionable is still transitioning
		// keep requesting updates
		if (this.xPosition.isActive()) {
			// set the position of the component's node
			// every frame to the value of the transitionable
			this.node.setPosition(this.xPosition.get());
			this.node.requestUpdateOnNextTick(this.id);
		}
	};

	var animation = new Animation(rootNode);
	animation.start();
});