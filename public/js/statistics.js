function dataHasRightToArray(data){
    const a = [["Имащи право на диплома","Брой студенти"],["Имат право",0],["Нямат право",0]];

    let rows=data.users;
    rows.forEach(row_data =>{
        switch(row_data.has_right){
            case 1: 
                a[1][1]++;
                break;
            case 0:
                a[2][1]++;
                break;
            default:
                break;
        }
    });
    return a;
}
function dataDegreeToArray(data){
    const a = [["Степен на образование","Брой студенти"],["Бакалавър",0],["Магистър",0]];
    
    let rows=data.users;
    rows.forEach(row_data =>{
        switch(row_data.degree){
            case 'Б': 
                a[1][1]++;
                break;
            case 'М':
                a[2][1]++;
                break;
            default:
                break;
        }
    });
    return a;
}
function dataGradesToArray(data){
    const a=[["Оценка","Брой студенти с такава оценка"],["[2-3)",0],["[3,4)",0],["[4,5)",0],["[5,6]",0]];
    let rows=data.users;
    rows.forEach(row_data =>{
        if(row_data.grade>=2 && row_data.grade<3){
            a[1][1]++;
        }else if (row_data.grade>=3 && row_data.grade<4){
            a[2][1]++;
        }else if (row_data.grade>=4 && row_data.grade<5){
            a[3][1]++;
        }else {
            a[4][1]++;
        }
    });
    return a;
}

function dataMajorToArray(data){

    const a = [["Специалност","Брой студенти"],["СИ",0],["КН",0],["ИС",0],["И",0],["М",0],["С",0],["х",0]];

    let rows=data.users;
    rows.forEach(row_data =>{
        switch(row_data.major){
            case 'СИ': 
                a[1][1]++;
                break;
            case 'КН':
                a[2][1]++;
                break;
            case 'ИС':
                a[3][1]++;
                break;
            case 'И':
                a[4][1]++;
                break;
            case 'М':
                a[5][1]++;
                break;
            case 'С':
                a[6][1]++;
                break;
            default:
                a[7][1]++;
                break;
        }
    });
    return a;
}