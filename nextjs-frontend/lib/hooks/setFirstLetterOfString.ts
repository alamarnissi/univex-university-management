
export const setFirstLetterOfString = (str: string) => {
    let acronym = str.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')
    return acronym;
    // return str.charAt(0).toUpperCase() + str.slice(1);
}