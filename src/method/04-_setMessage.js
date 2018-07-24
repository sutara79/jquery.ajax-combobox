/*global $*/
/** @lends external:jQuery.ajaxComboBox.prototype */
export default {
  /**
   * @private
   * @desc プラグインの中で使うメッセージを設定する
   */
  _setMessage: function() {
    var message;
    switch (this.option.lang) {
      // German (Thanks Sebastian Gohres)
      case 'de':
        message = {
          add_btn     : 'Hinzufügen-Button',
          add_title   : 'Box hinzufügen',
          del_btn     : 'Löschen-Button',
          del_title   : 'Box löschen',
          next        : 'Nächsten',
          next_title  : 'Nächsten' + this.option.per_page + ' (Pfeil-rechts)',
          prev        : 'Vorherigen',
          prev_title  : 'Vorherigen' + this.option.per_page + ' (Pfeil-links)',
          first_title : 'Ersten (Umschalt + Pfeil-links)',
          last_title  : 'Letzten (Umschalt + Pfeil-rechts)',
          get_all_btn : 'alle (Pfeil-runter)',
          get_all_alt : '(Button)',
          close_btn   : 'Schließen (Tab)',
          close_alt   : '(Button)',
          loading     : 'lade...',
          loading_alt : '(lade)',
          page_info   : 'num_page_top - num_page_end von cnt_whole',
          select_ng   : 'Achtung: Bitte wählen Sie aus der Liste aus.',
          select_ok   : 'OK : Richtig ausgewählt.',
          not_found   : 'nicht gefunden',
          ajax_error  : 'Bei der Verbindung zum Server ist ein Fehler aufgetreten. (ajax-combobox)'
        };
        break;

      // English
      case 'en':
        message = {
          add_btn     : 'Add button',
          add_title   : 'add a box',
          del_btn     : 'Del button',
          del_title   : 'delete a box',
          next        : 'Next',
          next_title  : 'Next' + this.option.per_page + ' (Right key)',
          prev        : 'Prev',
          prev_title  : 'Prev' + this.option.per_page + ' (Left key)',
          first_title : 'First (Shift + Left key)',
          last_title  : 'Last (Shift + Right key)',
          get_all_btn : 'Get All (Down key)',
          get_all_alt : '(button)',
          close_btn   : 'Close (Tab key)',
          close_alt   : '(button)',
          loading     : 'loading...',
          loading_alt : '(loading)',
          page_info   : 'num_page_top - num_page_end of cnt_whole',
          select_ng   : 'Attention : Please choose from among the list.',
          select_ok   : 'OK : Correctly selected.',
          not_found   : 'not found',
          ajax_error  : 'An error occurred while connecting to server. (ajax-combobox)'
        };
        break;

      // Spanish (Thanks Joaquin G. de la Zerda)
      case 'es':
        message = {
          add_btn     : 'Agregar boton',
          add_title   : 'Agregar una opcion',
          del_btn     : 'Borrar boton',
          del_title   : 'Borrar una opcion',
          next        : 'Siguiente',
          next_title  : 'Proximas ' + this.option.per_page + ' (tecla derecha)',
          prev        : 'Anterior',
          prev_title  : 'Anteriores ' + this.option.per_page + ' (tecla izquierda)',
          first_title : 'Primera (Shift + Left)',
          last_title  : 'Ultima (Shift + Right)',
          get_all_btn : 'Ver todos (tecla abajo)',
          get_all_alt : '(boton)',
          close_btn   : 'Cerrar (tecla TAB)',
          close_alt   : '(boton)',
          loading     : 'Cargando...',
          loading_alt : '(Cargando)',
          page_info   : 'num_page_top - num_page_end de cnt_whole',
          select_ng   : 'Atencion: Elija una opcion de la lista.',
          select_ok   : 'OK: Correctamente seleccionado.',
          not_found   : 'no encuentre',
          ajax_error  : 'Un error ocurrió mientras conectando al servidor. (ajax-combobox)'
        };
        break;

      // Brazilian Portuguese (Thanks Marcio de Souza)
      case 'pt-br':
        message = {
          add_btn     : 'Adicionar botão',
          add_title   : 'Adicionar uma caixa',
          del_btn     : 'Apagar botão',
          del_title   : 'Apagar uma caixa',
          next        : 'Próxima',
          next_title  : 'Próxima ' + this.option.per_page + ' (tecla direita)',
          prev        : 'Anterior',
          prev_title  : 'Anterior ' + this.option.per_page + ' (tecla esquerda)',
          first_title : 'Primeira (Shift + Left)',
          last_title  : 'Última (Shift + Right)',
          get_all_btn : 'Ver todos (Seta para baixo)',
          get_all_alt : '(botão)',
          close_btn   : 'Fechar (tecla TAB)',
          close_alt   : '(botão)',
          loading     : 'Carregando...',
          loading_alt : '(Carregando)',
          page_info   : 'num_page_top - num_page_end de cnt_whole',
          select_ng   : 'Atenção: Escolha uma opção da lista.',
          select_ok   : 'OK: Selecionado Corretamente.',
          not_found   : 'não encontrado',
          ajax_error  : 'Um erro aconteceu enquanto conectando a servidor. (ajax-combobox)'
        };
        break;

      // Japanese (ja)
      default:
        message = {
          add_btn     : '追加ボタン',
          add_title   : '入力ボックスを追加します',
          del_btn     : '削除ボタン',
          del_title   : '入力ボックスを削除します',
          next        : '次へ',
          next_title  : '次の' + this.option.per_page + '件 (右キー)',
          prev        : '前へ',
          prev_title  : '前の' + this.option.per_page + '件 (左キー)',
          first_title : '最初のページへ (Shift + 左キー)',
          last_title  : '最後のページへ (Shift + 右キー)',
          get_all_btn : '全件取得 (下キー)',
          get_all_alt : '画像:ボタン',
          close_btn   : '閉じる (Tabキー)',
          close_alt   : '画像:ボタン',
          loading     : '読み込み中...',
          loading_alt : '画像:読み込み中...',
          page_info   : 'num_page_top - num_page_end 件 (全 cnt_whole 件)',
          select_ng   : '注意 : リストの中から選択してください',
          select_ok   : 'OK : 正しく選択されました。',
          not_found   : '(0 件)',
          ajax_error  : 'サーバとの通信でエラーが発生しました。(ajax-combobox)'
        };
    }
    this.message = message;
  },
};