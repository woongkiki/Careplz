export const textLengthOverCut = (txt, len, lastTxt) => {
    if (len == "" || len == null) { // 기본값
        len = 20;
    }
    if (lastTxt == "" || lastTxt == null) { // 기본값
        lastTxt = "";
    }
    if (txt.length > len) {
        txt = txt.substr(0, len) + lastTxt;
    }
    return txt;
}


export const numberFormat = (num) => {
    if(num != "") {
      num = num.toString().replace(/[^0-9]/g,'') * 1;
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

export const addComma = (num) => {
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return num.toString().replace(regexp, ',');
}

export const phoneFormat = (phone) => {
    return phone
      .replace(/[^0-9]/g, '')
      .replace(
        /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
        '$1-$2-$3'
      )
      .replace('--', '-');
  };

export const validateDate = (text) => {
    //const regex = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/; 
    //return regex.test(text);

    const regExp = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
    return regExp.test(text); 
}
  
export const randomNumber = (n) => {
    let str = '';
    let i_ = 1;

    for (i_; i_ <= n; i_++) {
        str += Math.floor(Math.random() * 10);
    }

    return str;
}

export const yearArray = () => {
    let yearArr = Array();
    let i = new Date().getFullYear();

    for(i;i>1920;i--){

        let datas = {"label":i + "년", "val":i};

        yearArr.push(datas);
    }

    return yearArr;
}

export const monthArray = () => {
    let monthArr = Array();
    let i = 1;

    for(i;i<=12;i++){
         let datas = {"label":i + "월", "val":i};

         monthArr.push(datas);
    }

    return monthArr;
}

export const dayArray = () => {
    let dayArr = Array();
    let i = 1;

    for(i;i<=31;i++){
        let datas = {"label":i + "일", "val":i};
        dayArr.push(datas);
    }

    return dayArr;

}