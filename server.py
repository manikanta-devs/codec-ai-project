import http.server
import socketserver
import urllib.parse
import json
import yfinance as yf

PORT = 8000

class StockRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if parsed_url.path == '/api/stock':
            query_params = urllib.parse.parse_qs(parsed_url.query)
            symbol = query_params.get('symbol', ['RELIANCE.NS'])[0]
            
            try:
                ticker = yf.Ticker(symbol)
                # Fetch 6 months of data to ensure at least 100 trading days
                hist = ticker.history(period="6mo")
                
                if hist.empty:
                    self.send_error_response(404, f"No data found for symbol {symbol}")
                    return
                
                # Get the last 100 days
                hist = hist.tail(100)
                
                prices_list = []
                for index, row in hist.iterrows():
                    prices_list.append({
                        "date": index.strftime('%Y-%m-%d'),
                        "open": float(row['Open']),
                        "high": float(row['High']),
                        "low": float(row['Low']),
                        "close": float(row['Close']),
                        "volume": int(row['Volume'])
                    })
                
                current_price = float(hist['Close'].iloc[-1])
                prev_close = float(hist['Close'].iloc[-2]) if len(hist) > 1 else current_price
                
                change = current_price - prev_close
                change_pct = (change / prev_close) * 100 if prev_close != 0 else 0
                
                # Default name fallback
                company_name = symbol
                try:
                    # Request info from ticker (with fallback if network timeout)
                    info = ticker.info
                    company_name = info.get('longName', symbol)
                except:
                    pass
                
                response_data = {
                    "symbol": symbol,
                    "companyName": company_name,
                    "currentPrice": round(current_price, 2),
                    "change": round(change, 2),
                    "changePercent": round(change_pct, 2),
                    "prices": prices_list
                }
                
                self.send_json_response(response_data)
                
            except Exception as e:
                self.send_error_response(500, f"Error fetching stock data: {str(e)}")
        else:
            super().do_GET()
            
    def send_json_response(self, data):
        response_bytes = json.dumps(data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', len(response_bytes))
        self.end_headers()
        self.wfile.write(response_bytes)
        
    def send_error_response(self, code, message):
        response_data = {"error": message}
        response_bytes = json.dumps(response_data).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', len(response_bytes))
        self.end_headers()
        self.wfile.write(response_bytes)

if __name__ == '__main__':
    # Enable address reuse to prevent port-in-use errors on restarts
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), StockRequestHandler) as httpd:
        print(f"Serving Aura Stock Modeller on port {PORT}")
        httpd.serve_forever()
