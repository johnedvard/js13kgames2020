# Black Jack 404

This is a game I made during the [js13kgames 2020 game jam](https://js13kgames.com/). The theme was **404**, not an easy theme to work around, but this is what I came up with.

My goal was always to make a game good enough to be in the top 100. There are a lot of good games submitted, so I am not sure if my game will make it.

## Rules

This is a variant the card game, Black Jack.

There are a total of 40 cards in the deck, with values from 1 to 10. There are four of each value.

Roughly half of the cards in the deck are 404-cards, and we do not know the values behind them. Once we decide to hold our hand, the cards are revealed.

Each player gets a starting hand with two cards each.

We need to bet once before we can hit (get) extra cards. It is possible to double your bet at any time. The reward is 150% of what you bet. Bet 10 chips and the reward is 15 chips.

The goal is to score score higher than the dealer, but not score more than 21. If you both have the same score, it is a draw, and you get your chips back.

The same deck is always used, but gets reshuffled when there are fewer than 10 cards left.

## Monetizition

This game also includes some monetiziation from [Coil](https://coil.com/about).

Coil Subscribers can enjoy the following:
* Select a custom card back
* Receive bonus chips while playing. The bet zone will fill up while playing, and once filled, the player receives 10 chips.

## Start testing your game

Run the following in your terminal window

```
npm install
npm run start
```

open http://localhost:1234/ in your browser

## Build

```
npm run build
```

## Content

* Most of the backgrounds on the card backs were found here http://projects.verou.me/css3patterns/ and modified to my liking
* The sound effects were made using https://github.com/KilledByAPixel/ZzFX
* The rest is made by me.

* I wrote the game using Typescript, html and css
* I used parcel to continously develop, and build the game.
