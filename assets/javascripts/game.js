cc.Class({
    extends: cc.Component,

    properties: {
        gem: {
            default: null,
            type: cc.Node
        },

        count: {
            default: null,
            type: cc.Label
        },

        gemPool: {
            default: null,
            type: cc.Node
        },

        lightGem: {
            default: null,
            type: cc.Prefab
        },

        winGame: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //this.lightGem.on(cc.Node.EventType.TOUCH_START, this._countGem, this);
        this.init();
    },

    init() {
        this.winGame.setPosition(cc.v2(0, 600));
        this.count.string = 0;
        this.gemPool.removeAllChildren();
        this.randomV2 = [];
        this.randomTotal = [5, 6, 7, 8][Math.floor(Math.random() * 4)];
        this._randomV2();
    },

    _randomV2() {
        if (this.randomV2.length < this.randomTotal) {
            let x = Math.random() > 0.5 ? -Math.floor(Math.random() * 900) : Math.floor(Math.random() * 900);
            let y = Math.random() > 0.5 ? -Math.floor(Math.random() * 480) : Math.floor(Math.random() * 480);
            this.randomV2.push(cc.v2(x, y));
            this._randomV2();
        } else {
            this._createLightGem();
        }
    },

    _createLightGem() {
        for (let m = 0; m < this.randomV2.length; m++) {
            let lightGem = cc.instantiate(this.lightGem);
            lightGem.parent = this.gemPool;
            lightGem.setPosition(this.randomV2[m]);
            lightGem.on(cc.Node.EventType.TOUCH_START, this._countGem, this);
        }
    },

    _countGem(event) {
        console.log(event);
        let lightGem = event.currentTarget;

        let position = this.gem.getPosition();
        let action1 = cc.moveTo(.4, position);
        let action2 = cc.scaleTo(.3, .4);
        let action3 = cc.removeSelf();
        let action4 = cc.callFunc(function () {
            let count = parseInt(this.count.string) + 1;
            this.count.string = count;
            if (this.randomV2.length == count) {
                let b1 = cc.moveTo(1, cc.v2(0, 0));
                let b2 = cc.scaleTo(.3, 1.2);
                let b3 = cc.scaleTo(.3, .8);
                let b4 = cc.scaleTo(.3, 1);
                this.winGame.runAction(cc.sequence(b1, b2, b3, b4));
            }
        }, this);

        let All = cc.sequence(action1, action2, action3, action4);
        lightGem.runAction(All);
    },

    // update (dt) {},
});
