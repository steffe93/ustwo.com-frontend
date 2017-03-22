import React, { Component } from 'react';
import classnames from 'classnames';
import Rimage from 'app/components/rimage';
import Flux from 'app/flux';

const posterURL = "/images/transparent.png";

// function initVideo(vid){
//   vid.play();
//
//   if(vid.readyState !== 4){
//     vid.addEventListener('canplaythrough', onCanPlay(vid), false);
//     vid.addEventListener('load', onCanPlay(vid), false);
//     setTimeout(() => {
//   		vid.pause();
//   	}, 1);
//   } else {
//
//   }
// }
//
// function onCanPlay(vid) {
//   return () => {
//     vid.removeEventListener('canplaythrough', onCanPlay, false);
// 	  vid.removeEventListener('load', onCanPlay, false);
//     Flux.heroVideoReady(true);
//   }
// }

// function initVideo(vid) {
//   if(vid.readyState !== 4){ //HAVE_ENOUGH_DATA
//     vid.addEventListener('canplaythrough', onCanPlay(vid), false);
//     vid.addEventListener('load', onCanPlay(vid), false); //add load event as well to avoid errors, sometimes 'canplaythrough' won't dispatch.
//   }
// }
//
// function onCanPlay(vid) {
//   // vid.removeEventListener('canplaythrough', onCanPlay, false);
//   // vid.removeEventListener('load', onCanPlay, false);
//   //video is ready
//   Flux.heroVideoReady(true);
//   console.log('can play');
// }

// function eventWindowLoaded(vid) {
//
//   //  vid.addEventListener('progress',updateLoadingStatus,false);
//    vid.addEventListener('canplaythrough', () => {
//      console.log('READY canplaythrough');
//      Flux.heroVideoReady(true);
//    }, false);
//
// }


class Video extends Component {

  componentWillReceiveProps(nextProps) {
    if (this.video) {
      if (nextProps.play) {
        this.video.play();
      } else {
        this.video.pause();
      }
    }
  }

  componentDidMount() {
    const { heroVideo, isMobile } = this.props;

    if (heroVideo) {

      if (isMobile) {
        Flux.heroVideoReady(true);
        // this.video.addEventListener('loadedmetadata', () => {
        //   setTimeout(() => {
        //   }, 1000);
        // }, false);
      } else {
        if (this.video.readyState != 4) {
          this.video.addEventListener('canplaythrough', () => {
            Flux.heroVideoReady(true);
          }, false);
        } else {
          Flux.heroVideoReady(true);
        }
      }
    }
  }

  componentWillUnmount() {
    Flux.heroVideoReady(false);
  }

  render() {
    const { isVideoBackground } = this.props;

    if(isVideoBackground) {
      return this.renderVideoBackground();
    } else {
      return this.renderVideoEmbed();
    }
  }

  renderVideoEmbed() {
    const { videoId, videoFrom } = this.props;
    let src;
    switch(videoFrom) {
      case 'vimeo':
        src = "https://player.vimeo.com/video/" + videoId;
        break;
      case 'youtube':
          src = "https://www.youtube.com/embed/" + videoId;
          break;
      default:
        src = "https://player.vimeo.com/video/" + videoId;
    }
    return (
      <div className="video">
        <iframe
          src={src}
          width="1280"
          height="720"
          frameborder="0"
          title="Video"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen>
        </iframe>
      </div>
    );
  }

  renderVideoBackground() {
    const { imageCSS, isMobile } = this.props;

    let styles;
    if (imageCSS && !isMobile) {
      styles = { backgroundImage: `url(${imageCSS})` }
    }
    const classes = classnames('videoBackground', { imageCSS });
    const fallback = isMobile ? <img className="video-mobile-fallback" src={imageCSS} /> : null;

    return (
      <div className={classes} style={styles}>
        {fallback}
        {this.renderVideo()}
      </div>
    );
  }

  renderImage() {
    if (!this.props.imageCSS) {
      const { sizes } = this.props;
      return (<Rimage sizes={sizes} />)
    }
  }

  renderVideo() {
    const { src, play } = this.props;

    let video;
    if(src && src.length) {
      video = (<video ref={(ref) => this.video = ref} src={src} poster={posterURL} playsInline loop muted />);
    } else {
      video = this.renderImage();
    }

    return video;
  }

};

export default Video;
