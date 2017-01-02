Welcome to my toolbox.

Each folder contains a handy do-dad of speeding up development. Reusable Components/Directives will be brought in here for improvement/sharing. See something handy? Grab it. See a improvement needed? Push a request. ( Like leave a penny, take a penny )

VIEWHOC  //start!

An overzealous higher order component for the perfect sized/placed children.

Why.
    I made a beautiful site with react-motion. Lots of love went into it and it looked glorious.
    Chrome, thanks to its wonderful dev tools, spoiled me. Safari and IE happened to be more strict
    and all the transitions using flexbox, percentage heights and widths, failed. After punch dancing out the anger in my quiet place, I noticed that height and width were not being inherited or computed when using percent in my SASS.

    This HOC was created to allow more browser support for responsive design by establishing a base container to distribute compiled (or overridden) values to its children.

How

    This HOC was created to utilize all window space (if you want) and provide children with non-conflicting, cross browser support.
    An even listener is added to watch for changes in window size. The HOC is given a config object (or uses the default), in this object the developer can specify the factor of size for each child component to use. This speeds up development by removing the headache of feeding dimensions down through multiple levels of props. Just make your presentational components responsive ( use percents to decide sizes! ) and allow this HOC to handle their placement.

    Config object:
      Provides children with the factor of height/width to use.
      Can PERFECTLY center children or float them to fill spaces.
      Allows to override the window height/width so as to be able to also be a child.
      Can be configured to use absolute positioning ( even while using a child to fill space in the middle )
      Can freeze sizes (locking at a certain size )
      Can choose a certain child to grow and fill up extra space but retain position without affecting siblings.

      EXAMPLE CONFIG
      const containerStyleObj= {

        // The index of each obj in the sizeArry is in respect to the position you add to the parameter in SizeHOC.

        sizeArray:[
            //freezeSize just causes that component to ignore window resize event
          {height:.1, width:.5, fill:false, centered: true, freezeSize: true},
            //Only one can be 'fill', or it will just apply to the last 'fill'
          {height:.2, width:1, fill: true, centered: false},
          {height:.1, width:1, fill: false, centered: false}
        ],
            //when supplied an override, the HOC will compile the factors and placement based upon it rather than //the window size.
        overrideHeight:null,
        overrideWidth:null,
        useAbsolute:true
      };

The above will give a the first and third child supplied 10% of the total height (in px) with the second taking up the rest of the space (with given minimum height of 20% of the total height),       



WITHOUT containerStyleObj

    It should work just fine. If the sizeArray is too long or too short, defaults will take over for that child and a config object is created for you.

    Default equally distributes the height and uses full width for each child. Each child is given 100% of the width and an equal distribution of the height. They are absolutely positioned with their 'top' being a distance of the height, of the pervious children, from the top. The container used to wrap the child has a relative position to allow the use of absolute in relation to THAT child.


 USAGE:



 -app.js

import SizeHOC from '';

render(){
  const desktopViewStyleObj= {

    sizeArray:[
      {height:.1, width:.5, fill:false, centered: true},
      {height:.2, width:1, fill: true, centered: false},
      {height:.1, width:1, fill: false, centered: false}
    ],

    overrideHeight:null,
    overrideWidth:null,
    useAbsolute:true
  };

  const mobileViewStyleObj= {

    sizeArray:[
      {height:.1, width:1, fill:false, centered: true},
      {height:.2, width:1, fill: true, centered: false},
      {height:.1, width:1, fill: false, centered: false}
    ],

    overrideHeight:null,
    overrideWidth:null,
    useAbsolute:true
  };

  cont desktopView = SizeHOC(desktopViewStyleObj)(ComponentONE, ComponentTwo, ComponentThree);
  cont mobileView = SizeHOC(mobileViewStyleObj)(ComponentONE, ComponentTwo, ComponentThree);

  return <div>{notMobileConditionMet? desktopView: mobileView}</div>
}

VIEWHOC //END!
