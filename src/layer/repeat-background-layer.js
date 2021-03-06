var RepeatBackgroundLayer = cc.Layer.extend(/** @lends RepeatBackgroundLayer# */{
	_className:"RepeatBackgroundLayer",
	nearBg: null,
	nearBgWidth: null,
	nearBgIndex: 0,

	ctor: function (camera, res, options) {
		this._super();
		cc.log("========>+RepeatBackgroundLayer=1"+this._createBg(res).bind(this));
		this.nearBg = this._tileBg(this._createBg(res).bind(this));
		
		var self = this;
		if (! options) {
			options = {scaleX: 2, scaleY: 1};
		}
		cc.log("========>+RepeatBackgroundLayer=2");
		camera.addListener(function (pos) {
			var eyeX = pos.x, eyeY = pos.y;
			self.refresh(eyeX / options.scaleX, eyeY/options.scaleY);
			self.setPosition(cc.p(-eyeX / options.scaleX, -eyeY/options.scaleY));
		});
	},

	refresh: function (eyeX, eyeY) {
		var newNearBgIndex = parseInt(eyeX / this.nearBg[0].width);
		if (this.nearBgIndex == newNearBgIndex) {
			return false;
		}
		this.nearBg[(newNearBgIndex + this.nearBg.length - 1) % this.nearBg.length].setPositionX(this.nearBg[0].width * (newNearBgIndex + this.nearBg.length - 1));
		this.nearBgIndex = newNearBgIndex;

		return true;
	},

	_tileBg: function (createMethod) {
		cc.log("======>_tileBg=1");
		var winSize = cc.director.getWinSize();
		var doubleWinWidth = 2 * winSize.width;
		var tiles = [];
		var remainWidth = doubleWinWidth;
		do {
			var nearBg = createMethod(cc.p(doubleWinWidth - remainWidth, 0));
			remainWidth -= nearBg.getContentSize().width;
			//cc.log("====>remainWidth="+remainWidth,nearBg);
			tiles.push(nearBg);
			this.addChild(nearBg);
		} while (remainWidth > 0);
		cc.log("======>_tileBg=3");
		if (tiles.length < 2) {
			var nearBg = createMethod(cc.p(doubleWinWidth - remainWidth, 0));
			tiles.push(nearBg);
			this.addChild(nearBg);
		}
		cc.log("======>_tileBg=2");
		return tiles;
	},

	_createBg: function (res) {
		return function (pos) {
			pos = pos || cc.p(0, 0);
			var bg = new cc.Sprite(res);
			bg.setPosition(pos);
			bg.attr({
				anchorX: 0,
				anchorY: 0
			});
			cc.log("======>bg="+bg.getContentSize().width,bg.getContentSize().height);
			return bg;
		};
	}
});