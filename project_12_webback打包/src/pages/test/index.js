import '../../style.scss';
import * as utils from '../../utils';
// import Photo from './asserts/img/photo.jpg';

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

async function getComponent() {
  const ele = document.createElement('div');
  const {
    default: _
  } = await import( /* webpackChunkName: "lodash" */ 'lodash');
  ele.innerHTML = _.join(['hello', 'webpack'], ' ');

  // // 添加图片
  // var photoImage = new Image();
  // photoImage.src = Photo;
  // ele.appendChild(photoImage);

  // 添加图片
  const photoEle = document.createElement('div')
  photoEle.className = 'photo';
  ele.appendChild(photoEle);

  // 添加按钮
  const btnEle = document.createElement('button');
  btnEle.innerHTML = 'Click me and check the console!';
  btnEle.onclick = () => console.error(utils.wordToNum('Two'));

  ele.appendChild(btnEle);

  return ele;
}

var element = null;
getComponent().then(component => {
  element = component;
  document.body.appendChild(element);
});


// if (module.hot) {
//   module.hot.accept('./print.js', function() {
//     console.log('Accepting the updated printMe module!');
//     printMe();
//     document.body.removeChild(element);
//     getComponent().then(component => {
//       element = component();
//       document.body.appendChild(element);
//     });
//   });
// }
