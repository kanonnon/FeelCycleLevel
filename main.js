// 全てのプログラムを配列に定義する
const programNameArray = [
  "BB1HIT1", "BB1HIT2", "BB1HIT3", "BB1HIT4", "BB1HIT5", "BB1HIT6", "BB1HIT7", "BB1HIT8", "BB1HIT9", "BB1HIT10", "BB1HIT11",
  "BB1COMP1", "BB1COMP2", "BB1COMP3", "BB1COMP4", "BB1HOUS1", "BB190's", "BB110's", "BB1TSFT", "BB1QUEEN", "BB1DVGT",
  "BB2HIT1", "BB2HIT2", "BB3HIT1", "BSBHIT1", "BSLHIT1", "BSWHIT1",
  // "BB2HIT3", "BB2HIT4", "BB2HIT5", "BB2HIT6", "BB2HIT7", "BB2HIT8", "BB2HIT9", "BB2HIT10",
  // "BB2HIT11", "BB2HIT12", "BB2HIT13", "BB2HIT14", "BB2HIT15", "BB2HIT16", "BB2HIT17", "BB2HIT18", "BB2HIT19", "BB2HIT20",
  // "BB2COMP1", "BB2COMP2", "BB2COMP3", "BB2COMP4", "BB2COMP5", "BB2HIT16", "BB2HH1", "BB2HH2", "BB2HOUS1", "BB2HOUS2", "BB2HOUS3",
  // "BB2SOUL1", "BB2REGG1", "BB2REGG2", "BB2ROCK1", "BB2ROCK2", "BB2UPGT1", "BB2UPGT2", "BB2JAZZ1", "BB2METAL1", "BB290's", "BB290's2",
  // "BB2MLN1", "BB2MLN2", "BB2EDM", "BB2DEEP1", "BB2DEEP2", "BB22016", "BB22017", "BB22018", "BB22019", "BB23-Y1", "BB23-Y2",
  // "BB2GRDY", "BB2PTX", "BB2MTGX", "BB2SIGALA", "BB2P!NK", "BB2JSTIN", "BB2JONAS", "BB2DVGT", "BB2ARGD", "SKRILLEX", "BB2BRMS",
  // "BB2RHNA", "BB2ZEDD", "BB2AVICII", "BB2FLG", "BB2MDNA", "BB2MJ1", "BB2MJ2", "BB2MJ3", "BB2BTLS2", "BB2BM1", "BB2QOP1", "BB2QUEEN", "BB2BRJ",
  // "BB2SUMR1", "BB2SUMR2", "BB2X'MAS1", "BB2X'MAS2",
  // "BB3HIT1", "BB3HIT2", "BB3HIT3", "BB3HIT4", "BB3HIT5", "BB3HIT6", "BB3HH1", "BB3HH2", "BB3HOUS1", "BB3HOUS2", "BB3HOUS3",
  // "BB3SOUL1", "BB3REGG1", "BB3ROCK1", "BB3ROCK2", "BB3WORLD1",
  // "BSBHIT1", "BSBHIT2", "BSBHIT3", "BSBHIT4", "BSBHIT5", "BSBHIT6", "BSBHIT7", "BSBROCK1", "BSBCOMP1", "BSBHH1", "BSBHOUS1", "BSBDEEP1", "BSBiHOUS1",
  // "BSLHIT1", "BSLHIT2", "BSLHIT3", "BSLHIT4", "BSLHIT5", "BSLHIT6", "BSLHIT7", "BSLHIT8", "BSLHOUS1", "BSLROCK1", "BSLDEEP1",
  // "BSWHIT1", "BSWHIT2", "BSWHIT3", "BSWHIT4", "BSWHIT5", "BSWHIT6", "BSWHIT7", "BSWHIT8", "BSWCOMP1", "BSWSOUL1", "BSWREGG1", "BSWROCK1",
  // "BSWiHH1", "BSWiHOUS1", "BSWiHOUS2", "BSWiMETAL1",
];

// データベースのデータを保存する変数
let dbdata = {};

// 初回かどうか判断するための変数
let visited;

// フォームを送信したらfirebaseに保存する
$("#program-form").on("submit", (e) => {
  e.preventDefault();

  // 入力されたデータの取得
  const addProgramName = $("#add-program-name").val();
  const addLeg = Number($("#add-leg").val());
  const addWaist = Number($("#add-waist").val());
  const addArm = Number($("#add-arm").val());
  const addTotal = addLeg + addWaist + addArm;
  const addProgramData = { addLeg, addWaist, addArm, addTotal };
  console.log(addProgramData);

  // 既存データを取得して計算
  const programData = dbdata[addProgramName];
  const times = programData.times;
  const currentTimes = times + 1;
  const calculatedLeg = (programData.addLeg * times + addLeg) / currentTimes;
  const calculatedWaist = (programData.addWaist * times + addWaist) / currentTimes;
  const calculatedArm = (programData.addArm * times + addArm) / currentTimes;
  const calculatedTotal = (programData.addTotal * times + addTotal) / currentTimes;
  const calculatedProgramData = {calculatedLeg, calculatedWaist, calculatedArm, calculatedTotal, currentTimes}


  // firebaseに`programs/${addProgramName}`をkeyとしてaddProgramDataというオブジェクトを保存する
  firebase.database().ref(`programs/${addProgramName}/addLeg`).set(Math.round(calculatedLeg * 100) / 100);
  firebase.database().ref(`programs/${addProgramName}/addWaist`).set(Math.round(calculatedWaist * 100) / 100);
  firebase.database().ref(`programs/${addProgramName}/addArm`).set(Math.round(calculatedArm * 100) / 100);
  firebase.database().ref(`programs/${addProgramName}/addTotal`).set(Math.round(calculatedTotal * 100) / 100);
  firebase.database().ref(`programs/${addProgramName}/times`).set(currentTimes);

  $("#exampleModal").modal("hide");
  location.reload();
});


// firebaseから取り出したデータを表示する
firebase.database().ref("programs").on("value", (snapshot) => {

  // 一旦画面やtableから各行を消す
  $("#table-value .table-tr").remove();


  // 全ブログラムの回数分、createProgramTr()を行う
  for (let i = 0; i < programNameArray.length; i++) {

    const programs = snapshot.val();
    dbdata = programs;

    // テーブルの新しい1行を作って返す
    const createProgramTr = (programNameArray, i) => {
      const $programTr = $("#table-template .table-tr").clone();
      $programTr.removeAttr("id");
      $programTr.find('.table-program-name').append(`<a href="#" class="program-name-link" data-toggle="modal" data-target="#exampleModal">${programNameArray[i]}</a>`);
      const sliceProgramName = programNameArray[i].slice(0, 3).toLowerCase();
      const programData = programs[programNameArray[i]];
      console.log(programData);
      $programTr.find('.table-leg').text(programData.addLeg);
      $programTr.find('.table-waist').text(programData.addWaist);
      $programTr.find('.table-arm').text(programData.addArm);
      $programTr.find('.table-total').text(programData.addTotal);
      $programTr.addClass(sliceProgramName);
      return $programTr;
    };

    // テーブルに新しい1行を追加する
    const $programTr = createProgramTr(programNameArray, i);
    $programTr.appendTo("#table-value");
  }

  // プログラム名を押したらinput要素にプログラム名を入れる
  $(".program-name-link").on("click", (e) => {
    $("#add-program-name").val($(e.target).text());
    $("#exampleModalLabel").text($(e.target).text());
    console.log($(e.target).text());
  });

  // DataTableを適用する（初回のみ）
  if (visited !== "yes") {
    $('#mytable').DataTable({
      pageLength: 100,
      sorting: [ [4, "DESC"] ],
    });
    visited = "yes";
    console.log(visited);
  }
});


// filteringをする
$("#filtering-select").on("change", () => {
  const filtering = $("#filtering-select").val();
  if (filtering === "all") {
    console.log("allの場合の処理");
  } else {
    console.log("elseの場合の処理");
    console.log(filtering);
    $(".table-tr").hide();
    $(`.${filtering}`).show();
  }
});
