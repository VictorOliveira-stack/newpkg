const sqlite3 = require('sqlite3-offline').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'data', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('ERRO CRÍTICO: Erro ao conectar ao banco de dados SQLite:', err.message);
        process.exit(1);
    } else {
        console.log('INFO: Conectado ao banco de dados SQLite em:', dbPath);
        db.run(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                descriçao TEXT
            )
        `, (createErr) => {
            if (createErr) {
                console.error('ERRO CRÍTICO: Erro ao criar tabela "books":', createErr.message);
            } else {
                console.log('INFO: Tabela "clientes" verificada/criada com sucesso.');
            }
        });
    }
});

const pool = {
    query: function(sql, params, callback) {
        console.log('DEBUG: pool.query chamado com SQL:', sql);
        console.log('DEBUG: Parâmetros da query:', params);

        if (typeof params === 'function') {
            callback = params;
            params = [];
        } else if (!params) {
            params = [];
        }

        if (sql.trim().toUpperCase().startsWith('SELECT')) {
            db.all(sql, params, function(err, rows) {
                if (err) {
                    console.error('ERRO: SELECT query falhou:', err.message);
                } else {
                    console.log('DEBUG: SELECT query executada com sucesso. Linhas retornadas:', rows.length);
                }
                callback(err, rows);
            });
        } else if (sql.trim().toUpperCase().startsWith('INSERT') ||
                   sql.trim().toUpperCase().startsWith('UPDATE') ||
                   sql.trim().toUpperCase().startsWith('DELETE')) {
            db.run(sql, params, function(err) {
                if (err) {
                    console.error('ERRO: INSERT/UPDATE/DELETE query falhou:', err.message);
                    callback(err);
                } else {
                    console.log('DEBUG: INSERT/UPDATE/DELETE query executada com sucesso.');
                    console.log('DEBUG: lastID:', this.lastID, 'changes:', this.changes);
                    callback(null, { affectedRows: this.changes, insertId: this.lastID });
                }
            });
        } else {
            db.run(sql, params, function(err) {
                if (err) {
                    console.error('ERRO: Generic DB.run query falhou:', err.message);
                } else {
                    console.log('DEBUG: Generic DB.run query executada com sucesso.');
                }
                callback(err);
            });
        }
    }
};

module.exports = pool;









/*const sqlite3 = require('sqlite3').verbose()

const path = require('path')

const dbPath = path.resolve(__dirname, '..', 'data', 'database.sqlite')

const db = new sqlite3.Database(dbPath, (err)=>{
    if (err){
        console.error('erro ao se conectar ao sqlite', err.message )
        process.exit(1)
    }else{
        console.log('conectato ao sqlite em', dbPath)

        //cria a tabela se ela ainda "clientes" existe fazendo o a estrutuda de banco de dados esta pronta no primeiro uso
        db.run(
            `CREATE TABLE IF NOT EXISTS clientes (
                id  INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                descriçao TEXT
                
            )`
            ,(createErr)=> {
                if (createErr){
                    console.error('erro ao criar tablea "clientes"', createErr.message)
                }else{
                    console.log('tabela criada "clientes" com sucesso.')
                }
            }
        )
    }
})

// SQLite não usa um "pool" de conexões da mesma forma que MySQL,
// mas para manter a compatibilidade com a interface `pool.query` 
// vamos criar um wrapper simples.
const pool = {
    /**
     * Executa uma query SQL no banco de dados SQLite.
     * @param {string} sql A string da query SQL.
     * @param {Array<any>} [params] Um array de parâmetros para a query (opcional).
     * @param {function} callback A função de callback (err, data).
     */


    /*query: function(sql,params, callback){
        // Ajusta os argumentos se 'params' for opcional (ex: pool.query(sql, callback))
        
         console.log('DEBUG: pool.query chamado com SQL:', sql);
         console.log('DEBUG: Parâmetros da query:', params);

        if(typeof params === 'function'){
            callback = params
            params= []
        } else if(!params){
            params = []
        }

         // Determina o método SQLite a ser usado baseado no tipo de query
        if(sql.trim().toUpperCase().startsWith('SELECT')){
             // Para queries SELECT que retornam múltiplas linhas
            db.all(sql, params, function(){
                if(err){
                     console.error('ERRO: SELECT query falhou:', err.message);
                }else{
                    console.log('DEBUG: SELECT query executada com sucesso. Linhas retornadas:', rows.length);
                }
                callback(err, rows)
            })

        }else if(
        sql.trim().toUpperCase().startsWith('INSERT') || 
        sql.trim().toUpperCase().startsWith('UPDATE')||
        sql.trim().toUpperCase().startsWith('DELETE')) {

            // Para queries de modificação (INSERT, UPDATE, DELETE)
            db.run(sql, params, function(err){
                if(err){
                      console.error('ERRO: INSERT/UPDATE/DELETE query falhou:', err.message)
                    callback(err)
                }else{
                    // Simula o objeto de resultado que o mysql2 poderia retornar
                    // 'this.lastID' é para INSERT, 'this.changes' é para UPDATE/DELETE
                    console.log('DEBUG: INSERT/UPDATE/DELETE query executada com sucesso.');
                    console.log('DEBUG: lastID:', this.lastID, 'changes:', this.changes);
                    callback(null,{affectedRows: this.changes, insetId: this.lastID})
                }
            })
        }else{
            // Para outros comandos SQL genéricos (como CREATE TABLE, etc.)
            db.run(sql, params, function(){
                if(err){
                    console.error('ERRO: Generic DB.run query falhou:', err.message);
                }else{
                    console.log('DEBUG: Generic DB.run query executada com sucesso.');
                }
                callback(err)
            })
        }
    }

}

module.exports = pool*/