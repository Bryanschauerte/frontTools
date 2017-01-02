import React from 'react';

// after import usage
// const viewStyleObj = {
  //   sizeArray:[
  //     {height:.2, width:.5, fill:false, centered: true},
  //     {height:.2, width:.5, fill:true, centered: true},
  //     {height:.2, width:.5, fill:false, centered: true}
  //   ],
  //   overrideHeight:500,
  //   overrideWidth:null,
  //   useAbsolute:true
  // };
// const someView = SizeHOC(viewStyleObj)(ComponentOne, componentTwo, ComponentThree);
// stick in the render <div>{someView}</div>
// components will be sized based on the default or the config

function validateStyleArrWithCompos(styleConfig, WrappedComponentsArr){
  let styleObj = styleConfig;

  //single component item that is added if needed
  const defaultConfigObj = {
    height: 1/WrappedComponentsArr.length || 1,
    width:1,
    fill:false,
    centered:false,
    freezeSize:false
  };

  if(!styleObj ){
    styleObj={};
    let defaultRatioAr = [];
    WrappedComponentsArr.map( (item, index)=> defaultRatioAr.push(defaultConfigObj) )
    styleObj.sizeArray = defaultRatioAr;
  }

//check the length, add remove as needed
  function addstyleObjToArr(styleConfigObj, Components){

      if(styleConfigObj.sizeArray.length < Components.length){
        styleConfigObj.sizeArray.push(defaultConfigObj);
      }
      else if(styleConfigObj.sizeArray.length > Components.length){
        styleConfigObj.sizeArray.pop();
      }else{
        return styleConfigObj;
      }

      return addstyleObjToArr(styleConfigObj, WrappedComponentsArr)

  }
  styleObj = addstyleObjToArr(styleObj, WrappedComponentsArr);
  return styleObj;

}

//fill uses each 'height' specified in the styleArray and grows the LAST one provided as needed
function fillActivate(obj){
  let totalHeightFromStyle =0;
  let totalWidthFromStyle =0;
  let targetIndex = null;

  let arrChecked = obj.sizeArray;

  arrChecked.map((item, index) => {
    item.topLocation = totalHeightFromStyle;
    totalHeightFromStyle += item.height;
    totalWidthFromStyle += item.width;
    if(item.fill){
      targetIndex = index;
    }

  })

  if(totalHeightFromStyle < 1 && targetIndex != null){
      let neededHAddition = 1 - totalHeightFromStyle;
      arrChecked[targetIndex].height+= neededHAddition;
      for(let x = targetIndex+1; x < arrChecked.length; x ++){
        arrChecked[x].topLocation += neededHAddition;
      }

  }

  if(totalHeightFromStyle > 1) {
    console.log("TOO MUCH HEIGHT SPECIFIED, will extend out of window")
  }

  obj.calculatedStyleArr= arrChecked;
  obj.indexOfFill = targetIndex;
  return obj;

}

const SizeHOC = containerStyleObj => (...WrappedComponents) => {

  let styleConfigObj = fillActivate(
    validateStyleArrWithCompos(containerStyleObj, WrappedComponents)
  );

    const TotalSized = WrappedComponents.map((InputComponent, index) =>{
      return class Base extends React.Component{

          static defaultProps={

          }
            constructor(props) {
                super(props);
                this.handleResize = this.handleResize.bind(this);
                this.handleStyleObj = this.handleStyleObj.bind(this);
                this.state = {
                  hasComputed: false,
                  width: 0,
                  height: 0,
                };
              }

              handleStyleObj(){
                const indivStyle = styleConfigObj.calculatedStyleArr[index];

                  const styleObj ={
                    height:this.state.height *indivStyle.height,
                    width:this.state.width *indivStyle.width,
                    float:indivStyle.centered? 'none':'left',
                    position:indivStyle.centered? 'block':'relative',
                    marginLeft:indivStyle.centered? 'auto':'incorrect',
                    marginRight:indivStyle.centered? 'auto':'incorrect',
                    backgroundColor: indivStyle.freezeSize? 'red':'green'

                  }

                  if(styleConfigObj.useAbsolute == true){

                    styleObj.position= 'absolute';
                    styleObj.top = indivStyle.topLocation*this.state.height;

                    if( indivStyle.centered ){
                      styleObj.left = (this.state.width - styleObj.width)/2
                    }

                  }
                  return styleObj;

              }

              useOverrideDimensions(){
                return {
                      width: styleConfigObj.overrideWidth,
                      height: styleConfigObj.overrideHeight,
                    };
              }

              getComputedDimensions() {

                let masterHeight = isNaN(window.innerHeight) ?
                    window.clientHeight : window.innerHeight;

                let masterWidth = isNaN(window.innerWidth) ?
                    window.clientWidth : window.innerWidth;

                return {
                      width: masterWidth,
                      height: masterHeight,
                    };
              }

              componentWillReceiveProps() {
                this.handleResize();
              }

              componentDidMount() {
                this.handleResize();
                window.addEventListener('resize', this.handleResize, false);
              }

              componentWillUnmount() {
                window.removeEventListener('resize', this.handleResize, false);
              }

              handleResize() {

                let h = this.getComputedDimensions().height;
                if(styleConfigObj.overrideHeight != null){
                  h = this.useOverrideDimensions().height;
                }

                let w = this.getComputedDimensions().width;

                if(styleConfigObj.overrideWidth != null){
                  w = this.useOverrideDimensions().width;
                }

                  if(this.state.hasComputed){
                    this.setState({
                      height:h,
                      width:w
                    })
                  }else{
                    this.setState({
                      hasComputed: true,
                      height:h,
                      width:w

                    });
                  }

              }
              shouldComponentUpdate(nextProps, nextState){
                if(styleConfigObj.calculatedStyleArr[index].freezeSize && this.state.hasComputed){
                  return false;
                }
                return true;
              }


            render() {

                return (
                  <div style={this.handleStyleObj()}>

                    <InputComponent
                      {...this.props}
                      indexOfComponent={index}
                      height={this.state.height}
                      width={this.state.width}
                      hadSizeComputed={this.state.hasComputed}/>
                  </div>)
              }

        }
    })

    return <div style={{position:'relative'}}>
      {
        TotalSized.map(Item=><Item key={Math.random()}/>)
      }
    </div>;

  }

export default SizeHOC;
