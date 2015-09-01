/**
*公历转伊历
*@method: toIsl
*@param: {Num} year
*@param: {Num} month
*@param: {Num} day
*@return: {iy: 伊历年,im: 伊历月,id: 伊历日,iw: 伊历第几周,jd: 儒略日}
*/

Date.extend({
    toIsl: function(date) {
        var islDateFix = conf.clock.islDateFix ? ~~conf.clock.islDateFix : 0;

        date = new Date(date);
        date.setDate(date.getDate() + islDateFix);

        var dateFormat = date.format(),
            y = dateFormat.y,
            m = dateFormat.M,
            d = dateFormat.d;
        
        if(m<3) {
            y -= 1;
            m += 12;
        }
        
        var a = Math.floor(y/100.),
            b = 2-a+Math.floor(a/4.),
            jd, bb, cc, dd, ee;
            
        if(y<1583) b = 0;
        if(y==1582) {
            if(m>10)  b = -10;
            if(m==10) {
                b = 0;
                if(d>4) b = -10;
            }
        }
        
        //求儒略日(julian day)
        jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+b-1524;
        
        b = 0;
        
        if(jd>2299160){
            a = Math.floor((jd-1867216.25)/36524.25);
            b = 1+a-Math.floor(a/4.);
        }
        bb = jd+b+1524;
        cc = Math.floor((bb-122.1)/365.25);
        dd = Math.floor(365.25*cc);
        ee = Math.floor((bb-dd)/30.6001);
        d = (bb-dd)-Math.floor(30.6001*ee);
        m = ee-1;
        if(ee>13) {
            cc += 1;
            m = ee-13;
        }
        y = cc-4716;
        
        
        /*
        从儒略日计算星期几
        function gmod(n,m){
            return ((n%m)+m)%m;
        }
        */
        var wd = (((jd+1)%7)+7)%7+1,
            iyear = 10631./30.,
            epochastro = 1948084,
            epochcivil = 1948085,
            shift1 = 8.01/60.,
            z = jd-epochastro,
            cyc = Math.floor(z/10631.),
            j,iy,im,id;
            
        z = z-10631*cyc;
        j = Math.floor((z-shift1)/iyear);
        iy = 30*cyc+j;
        z = z-Math.floor(j*iyear+shift1);
        im = Math.floor((z+28.5001)/29.5);
        if(im==13) im = 12;
        id = z-Math.floor(29.5001*im-29);

        var _fixDate = Gl.date && Gl.date.fixResult(conf.date.isl && conf.date.isl.fixDate, dateFormat.y, dateFormat.M, dateFormat.d, iy, im, id);
        return {
            iy: _fixDate.y,     //islamic year
            im: _fixDate.m,     //islamic month
            id: _fixDate.d,     //islamic date
            
            iw: wd,     //weekday number
            jd: jd-1    //julian day number
        }
    }
})