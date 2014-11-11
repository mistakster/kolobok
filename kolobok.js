(function () {

	function defineClass(Base) {
		var Entity = function () {};
		if (Base) {
			Entity.prototype = new Base();
		}
		return Entity;
	}



	var Person = defineClass();

	var grandDad = new Person();
	var grandMom = new Person();

	var RoundBread = defineClass();

	Person.prototype.ask = function (person) {
		return {
			bakeBread: function () {
				return new RoundBread();
			}
		}
	};

	var kolobok = grandDad.ask(grandMom).bakeBread();

	RoundBread.prototype.setPlace = function (place) {
		console.log('Kolobok is ' + place);
		this.place = place;
	};

	kolobok.setPlace('on the window');

	setTimeout(function () {
		kolobok.roll(farFarAway);
	}, Math.random() * 1000);

	RoundBread.prototype.roll = function (done) {

		var that = this;
		var places = ['on the bench', 'on the floor', 'at the door', 'on the yard', 'far-far away'];

		(function loop(i) {
			if (i >= places.length) {
				done(that);
				return;
			}
			that.setPlace(places[i]);
			setTimeout(function () {
				loop(i + 1);
			}, Math.random() * 500);
		})(0);

	};

	RoundBread.prototype.meet = function (creature) {
		this.acquaintances = this.acquaintances || [];
		this.acquaintances.push(creature.name);
		creature.on('eat', this.sing.bind(this));
		creature.on('place', function (place) {
			this.setPlace(place);
			return 'OK.';
		}.bind(this));
	};

	RoundBread.prototype.sing = function () {
		var acquaintances = this.acquaintances.slice();
		return 'I beg you, ' + acquaintances.pop() + '.\n' +
			'Don’t eat me, please.\n' +
			(this.acquaintances.length > 1 ? 'I run away from ' + acquaintances.join(', ') + '\n' : '') +
			'I’ll trick you';
	};

	function farFarAway(escapee) {

		var Creature = defineClass();
		Creature.prototype.on = function (request, responseFn) {
			this.requests = this.requests || {};
			this.requests[request] = responseFn;
		};
		Creature.prototype.trigger = function (request, extra) {
			if (this.requests[request]) {
				console.log(this.requests[request](extra));
			}
		};
		Creature.prototype.attack = function () {
			return false;
		};


		[
			function () {
				var Hare = defineClass(Creature);
				Hare.prototype.name = 'Hare';
				return new Hare();
			},
			function () {
				var Wolf = defineClass(Creature);
				Wolf.prototype.name = 'Wolf';
				return new Wolf();
			},
			function () {
				var Bear = defineClass(Creature);
				Bear.prototype.name = 'Bear';
				return new Bear();
			},
			function () {
				var Fox = defineClass(Creature);
				Fox.prototype.name = 'Fox';
				Fox.prototype.replaceAttack = function (fn) {
					Fox.prototype.attack = fn;
				};

				Fox.prototype.attack = function () {
					this.trigger('place', 'on the nose');
					this.replaceAttack(function () {
						this.trigger('place', 'in the mouth');
						this.replaceAttack(function () {
							console.log('Fox ate Kolobok');
							return false;
						});
						return true;
					});
					return true;
				};

				return new Fox();
			}
		].forEach(function (road) {
				var animal = road();
				escapee.meet(animal);
				do {
					animal.trigger('eat');
				} while (animal.attack())
			});

		console.info('The end!');
	}

}());
