import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo';

import Pagination from './src/Pagination';
import Header from './src/Header';
import Card, {
  CARD_STATUS,
  itemWidth,
  sliderWidth,
  horizontalMargin,
} from './src/Card';
import Carousel from './src/Carousel';

import { icons } from '../constants';

export default class ExpandingCollection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paginationIndex: 0,
      animatedValues: [],
      opacityValues: [],
      dragEnabled: true,
    };

    this.cards = [];

    StatusBar.setHidden(true);
  }

  componentWillMount() {
    const animatedValues = [], opacityValues = [];

    this.props.data.forEach(() => {
      animatedValues.push(new Animated.Value(0));
      opacityValues.push(new Animated.Value(0));
    });

    this.setState({ opacityValues, animatedValues });
  }

  onSnapToItem = (index) => {
    const { paginationIndex } = this.state;

    this.cards[paginationIndex].closeCard();
    
    this.setState({ paginationIndex: index });
  }

  renderItem = ({ item, index }) => {
    const { opacityValues, paginationIndex, animatedValues } = this.state;
    const { data } = this.props;

    return (
      <Card
        ref={ref => { this.cards[index] = ref; }}
        key={item.id}
        index={index}
        paginationIndex={paginationIndex}
        paginationLength={data.length}
        animatedValue={animatedValues[index]}
        opacityValues={opacityValues}
        data={item}
        onOpenToFull={() => { this.setState({ dragEnabled: false }); }}
        onFullToOpen={() => { this.setState({ dragEnabled: true }); }}
        enableScroll={() => this.carousel.enableScroll()}
        disableScroll={() => this.carousel.disableScroll()}
      />
    );
  }

  render() {
    const { data } = this.props;
    const { paginationIndex, dragEnabled, animatedValues } = this.state;

    return (
      <LinearGradient
        colors={['#c7d0d9', '#a1acbe', '#91a2b6']}
        style={{ flex: 1 }}
      >
        <Carousel
          ref={ref => { this.carousel = ref; }}
          data={data}
          renderItem={this.renderItem}
          sliderWidth={sliderWidth}
          onSnapToItem={this.onSnapToItem}
          itemWidth={itemWidth + (horizontalMargin * 2)}
          animatedValue={animatedValues[paginationIndex]} 
          enableSnap
          enableMomentum
          scrollEnabled={dragEnabled}
          decelerationRate="fast"
          inactiveSlideOpacity={0.4}
        >
          {
            data.map((value, index) => this.renderItem({ item: value, index }))
          }
        </Carousel>
        <Header
          title="TOFIND"
          animatedValue={animatedValues[paginationIndex]}
          isCardFull={!dragEnabled}
          onLocationPress={() => this.cards[paginationIndex].hideCardFull()}
        />
        <Pagination
          index={paginationIndex + 1}
          length={data.length}
          animatedValue={animatedValues[paginationIndex]}
        />
      </LinearGradient>
    );
  }
}
